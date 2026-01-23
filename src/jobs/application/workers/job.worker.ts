import type { JobHandlers, JobRepository } from '../../domain/index.js'
import { executeWithPolicy } from '../dispatchers/execution-context.dispatcher.js'

export class JobWorker {
  constructor(
    private readonly repository: JobRepository,
    private readonly handlers: JobHandlers
  ) { }

  async runOnce(): Promise<void> {
    const job = await this.repository.findNextPending()

    if (!job) return

    // marca como running
    job.status = 'running'
    job.updatedAt = new Date()
    await this.repository.update(job)

    const result = await executeWithPolicy(job, this.handlers, { maxAttempts: 3 })

    if (result.status === 'success') {
      job.status = 'success'
    } else {
      job.status = 'failure'
    }

    job.updatedAt = new Date()
    await this.repository.update(job)

    console.log(`[JOB ${job.id}]`, result)
  }
}
