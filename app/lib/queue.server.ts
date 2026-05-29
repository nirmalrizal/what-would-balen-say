import PQueue from "p-queue";

export const claudeQueue = new PQueue({ concurrency: 3 });

export function getQueueSize(): number {
  return claudeQueue.size;
}
