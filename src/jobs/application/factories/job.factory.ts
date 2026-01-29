import { randomUUID } from 'node:crypto'
import type {
  JobType,
  JobPayloads,
  JobRepository,
  JobEntity
} from '../../domain/index.js'

import type { JobQueue } from '../../domain/queues/job.queue.js'

export class JobFactory {
  constructor(
    private readonly repository: JobRepository,
    private readonly queue: JobQueue
  ) { }

  async create<T extends JobType>(
    type: T,
    payload: JobPayloads[T]
  ): Promise<JobEntity<T>> {
    const now = new Date()

    const job: JobEntity<T> = {
      id: randomUUID(),
      type,
      payload,
      status: 'pending',
      attempts: 0,
      createdAt: now,
      updatedAt: now
    }

    await this.repository.save(job)

    await this.queue.enqueue(job.id)

    return job
  }
}

