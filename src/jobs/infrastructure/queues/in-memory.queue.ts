import type { JobQueue } from '../../application/queues/job.queue.js'

export class InMemoryJobQueue implements JobQueue {
  private queue: string[] = []

  async enqueue(jobId: string): Promise<void> {
    this.queue.push(jobId)
  }

  async dequeue(): Promise<string | undefined> {
    return this.queue.shift()
  }
}
