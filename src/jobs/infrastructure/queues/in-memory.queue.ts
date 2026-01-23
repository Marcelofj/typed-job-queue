import type { Job, JobType } from '../../domain/index.js'
import type { JobQueue } from './job.queue.js'

export class InMemoryJobQueue implements JobQueue {
  private queue: Job<any>[] = []

  async enqueue<T extends JobType>(job: Job<T>): Promise<void> {
    this.queue.push(job)
  }

  async dequeue(): Promise<Job<any> | undefined> {
    return this.queue.shift()
  }
}