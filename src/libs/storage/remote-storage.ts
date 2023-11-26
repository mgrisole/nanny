import { execa } from "execa";
import { logger } from "../logger/index.js";
import { rmSync } from "node:fs";

export const upload = async (
  sourcePath: string,
  removeSourceAfterUpload = true,
) => {
  return new Promise((resolve) => {
    const destPath = "Freebox/Nanny";
    const ftpHost = "mafreebox.freebox.fr";

    const uploadProcess = execa("./ncftpput", [
      "-u",
      "freebox",
      "-p",
      "ix3i8PfQpfTEX7FP",
      ftpHost,
      destPath,
      sourcePath,
    ]);

    uploadProcess.stdout?.on("data", (data) => logger.info(data));
    uploadProcess.stderr?.on("data", (data) => logger.info(data));
    uploadProcess.stdout?.on("close", () => {
      logger.info(
        `${sourcePath} successfully uploaded in ftp://${ftpHost}/${destPath}`,
      );
      if (removeSourceAfterUpload) {
        rmSync(sourcePath);
      }
      resolve(true);
    });
  });
};
