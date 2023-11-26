import { logger } from "../logger/index.js";
import { execSync } from "child_process";
import { ProgressBar } from "@opentf/cli-pbar";
import { execa } from "execa";
import { existsSync } from "node:fs";

const convertProgressOutputToObject = (progressOutput: string) => {
  const result: { [key: string]: string } = {};
  const progressOutputList = progressOutput.split("\n");

  progressOutputList.forEach((item) => {
    const [key, value] = item.split("=");
    if (key !== undefined) {
      result[key] = value;
    }
  });

  return result;
};

const mergedDurationInSecondsFromProgressOutput = (
  rawProgressOutput: string,
) => {
  const { out_time } = convertProgressOutputToObject(
    rawProgressOutput.toString(),
  );
  const [hours, minutes, seconds] = out_time.split(":").map(parseFloat);
  return (hours * 60 + minutes) * 60 + seconds;
};

const generateOutputFileName = (basePath: string) => {
  return `${basePath}/${new Date().getTime()}.avi`;
};

export const captureChunk = async ({
  durationInMinutes,
  currentIterationIndex,
  totalIterations,
  outputPath,
}: captureChunkOptions) => {
  const chunkPath = generateOutputFileName(outputPath);
  logger.info(
    `Capturing ${currentIterationIndex + 1}/${totalIterations}: ${chunkPath}`,
  );
  execSync(
    `ffmpeg -t ${
      durationInMinutes * 60
    } -f avfoundation -framerate 30 -pixel_format yuyv422 -i "0" ${chunkPath}`,
  );
  return chunkPath;
};

export const mergeChunks = async (
  chunkPaths: string[],
  captureDurationInMinutes: number,
  outputPath: string,
): Promise<string> => {
  const capturePath = generateOutputFileName(outputPath);
  return new Promise((resolve) => {
    const pBar = new ProgressBar();
    logger.info(`Merging: ${outputPath}`);

    pBar.start({ total: 100 });
    const process = execa("ffmpeg", [
      "-i",
      `concat:${chunkPaths.join("|")}`,
      "-c",
      "copy",
      "-an",
      capturePath,
      "-progress",
      "-",
    ]);

    process.stdout?.on("data", (data) => {
      const progress = Math.ceil(
        (mergedDurationInSecondsFromProgressOutput(data) * 100) /
          (captureDurationInMinutes * 60),
      );
      pBar.update({
        value: progress > 100 ? 100 : progress,
      });
    });

    process.stdout?.on("close", () => {
      pBar.stop();

      if (existsSync(capturePath)) {
        execSync(`rm ${chunkPaths.join(" ")}`);
        logger.info(`Capture successfully merged: ${capturePath}`);
        resolve(capturePath);
      }
    });
  });
};

type captureChunkOptions = {
  durationInMinutes: number;
  currentIterationIndex: number;
  totalIterations: number;
  outputPath: string;
};
