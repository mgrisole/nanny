export const chunksGenerator = (durationInMinutes: number, chunkDurationLimitInMinutes: number): number[] => {
  const totalOfFullDurationChunks = ~~(durationInMinutes / chunkDurationLimitInMinutes);
  const remainingChunkDurationInMinutes = Math.round(durationInMinutes % chunkDurationLimitInMinutes * 100) / 100;

  return [
    ...Array.from({length: totalOfFullDurationChunks}, () => chunkDurationLimitInMinutes),
    ...(remainingChunkDurationInMinutes ? [remainingChunkDurationInMinutes] : [])
  ]
}
