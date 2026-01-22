import type { Job, JobType } from '../../domain'
import type { JobQueue } from './job.queue'

export class InMemoryJobQueue implements JobQueue {
  private queue: Job<any>[] = []

  async enqueue<T extends JobType>(job: Job<T>): Promise<void> {
    this.queue.push(job)
  }

  async dequeue(): Promise<Job<any> | undefined> {
    return this.queue.shift()
  }
}