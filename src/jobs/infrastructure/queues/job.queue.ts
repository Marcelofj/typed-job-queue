export interface JobQueue {
  enqueue(jobId: string): Promise<void>
  dequeue(): Promise<string | undefined>
}
