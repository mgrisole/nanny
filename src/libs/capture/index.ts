import { captureChunk, mergeChunks } from "./utils.js";
import { generateOutputPath } from "@libs/storage/local-storage.js";
import { chunksGenerator } from "../../utils.js";

export const capture = async (
  durationInMinutes: number,
  chunkDurationLimitInMinutes = 5,
): Promise<string> => {
  const outputPath = generateOutputPath();

  const chunks = chunksGenerator(
    durationInMinutes,
    chunkDurationLimitInMinutes,
  );

  const capturesPaths = await Promise.all(
    chunks.map((durationInMinutes, currentIterationIndex) =>
      captureChunk({
        durationInMinutes,
        totalIterations: chunks.length,
        currentIterationIndex,
        outputPath,
      }),
    ),
  );

  return capturesPaths.length > 1
    ? await mergeChunks(capturesPaths, durationInMinutes, outputPath)
    : capturesPaths[0];
};
