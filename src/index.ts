import { upload } from "@libs/storage/remote-storage.js";
import { capture } from "@libs/capture/index.js";
import { logger } from "@libs/logger/index.js";
import { chunksGenerator } from "./utils.js";
import prompts from "prompts";
import datePrompt from "date-prompt";

const { maximumCaptureDurationInMinutes } = await prompts({
  type: "number",
  float: true,
  name: "maximumCaptureDurationInMinutes",
  message: "What is the maximum duration of each recording (in minutes)?",
});

const captureEndDate = await datePrompt("When should it stop recording?");

const duration =
  (new Date(captureEndDate).getTime() - new Date().getTime()) / 60e3;
if (duration <= 0) {
  logger.warn(`Capture's end date time must be greater than current datetime.`);
  process.exit(1);
}

chunksGenerator(duration, maximumCaptureDurationInMinutes).map(
  async (chunkDurationInMinute) => {
    return upload(await capture(chunkDurationInMinute), false);
  },
);
