import { randomUUID } from 'node:crypto'
import type {
  JobType,
  JobPayloads,
  JobRepository,
  JobEntity
} from '../../domain/index.js'

export class CreateJobFactory {
  constructor(private readonly repository: JobRepository) { }

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

    return job
  }
}

