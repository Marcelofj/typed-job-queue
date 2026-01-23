import type { Job, JobType } from '../../domain/index.js'

export interface JobQueue {
  enqueue<T extends JobType>(job: Job<T>): Promise<void>
  dequeue(): Promise<Job<any> | undefined>
}