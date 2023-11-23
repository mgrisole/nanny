import {captureChunk, mergeChunks} from "../libs/capture/index.js";
import ftpClient from 'ftp';

// let chunkDurationLimitInMinutes = 5;
//
// const capture = async (captureDurationInMinutes: number) => {
//
//   if (captureDurationInMinutes <= chunkDurationLimitInMinutes) {
//     captureChunk(captureDurationInMinutes, 1, 1);
//     return;
//   }
//
//   let capturesPaths: string[] = [];
//   const totalOfFullDurationChunks = ~~(captureDurationInMinutes / chunkDurationLimitInMinutes);
//   const remainingChunkDurationInMinutes = captureDurationInMinutes % chunkDurationLimitInMinutes;
//
//   for (let i = 1; i <= totalOfFullDurationChunks; i++) {
//     capturesPaths.push(captureChunk(chunkDurationLimitInMinutes, i, totalOfFullDurationChunks));
//   }
//
//   if (remainingChunkDurationInMinutes) {
//     capturesPaths.push(captureChunk(remainingChunkDurationInMinutes, totalOfFullDurationChunks, totalOfFullDurationChunks))
//   }
//
//   await mergeChunks(capturesPaths, captureDurationInMinutes)
// }
//
// await capture(60);

const client = new ftpClient();
client.on('ready', function() {
  client.list('Freebox/Nanny', function(err, list) {
    if (err) throw err;
    console.dir(list);
    client.end();
  });
});

client.connect({
  host: 'mafreebox.freebox.fr',
  user: 'freebox',
  password: 'Yfgmok!JrEi6J6#R'
});
