import {existsSync, mkdirSync} from "node:fs";

export const generateOutputPath = (basePath = './captures-local-storage') => {

  if (!existsSync(basePath)) {
    mkdirSync(basePath)
  }

  return `${basePath}`;
}
