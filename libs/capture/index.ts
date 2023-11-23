import {execSync} from "child_process";
import {ProgressBar} from '@opentf/cli-pbar';
import {execa} from 'execa'
import {logger} from "../logger/index.js";
import {existsSync} from "fs";

const generateOutputPath = () => {
  return `/Volumes/Freebox/Nanny/${new Date().getTime()}.avi`;
}

const convertProgressOutputToObject = (progressOutput: string) => {
  const result: { [key: string]: string } = {};
  const progressOutputList = progressOutput.split('\n');

  progressOutputList.forEach((item) => {
    const [key, value] = item.split('=');
    if (key !== undefined) {
      result[key] = value;
    }
  });

  return result;
};

const mergedDurationInSecondsFromProgressOutput = (rawProgressOutput: string) => {
  const {out_time} = convertProgressOutputToObject(rawProgressOutput.toString());
  const [hours, minutes, seconds] = out_time.split(':').map(parseFloat);
  return (hours * 60 + minutes) * 60 + seconds;
};

export const captureChunk = (durationInMinutes: number, currentIndex: number, totalIterrations: number) => {
  const outputPath = generateOutputPath();
  logger.info(`Capturing ${currentIndex}/${totalIterrations}: ${outputPath}`)
  execSync(`ffmpeg -t ${durationInMinutes * 60} -f avfoundation -framerate 30 -pixel_format yuyv422 -i "0" ${outputPath}`);
  
  return outputPath;
}

export const mergeChunks = async (chunkPaths: string[], captureDurationInMinutes: number) => {
  const pBar = new ProgressBar();
  const outputPath = generateOutputPath();
  logger.info(`Merging: ${outputPath}`)

  pBar.start({total: 100});
  const process = execa('ffmpeg', [
    '-i', `concat:${chunkPaths.join('|')}`,
    '-c', 'copy',
    '-an',
    outputPath,
    '-progress', '-'
  ])

  process.stdout?.on('data', (data) => {
    pBar.update({value: Math.ceil(mergedDurationInSecondsFromProgressOutput(data) * 100 / (captureDurationInMinutes * 60))})
  });

  process.stdout?.on('close', () => {
    pBar.stop();

    if (existsSync(outputPath)) {
      execSync(`rm ${chunkPaths.join(' ')}`);
    }
  })
}

