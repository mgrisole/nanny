import { upload } from "@libs/storage/remote-storage.js";
import { capture } from "@libs/capture/index.js";

await upload(await capture(0.25, 0.05));
