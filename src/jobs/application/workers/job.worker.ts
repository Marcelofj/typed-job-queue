import type { JobQueue } from '../../infrastructure/queues/job.queue'
import type { JobHandlers } from '../../domain/types/handlers.type'
import { executeWithPolicy } from '../dispatchers/execution-context.dispatcher'

export class JobWorker {

  constructor(
    private queue: JobQueue,
    private handlers: JobHandlers
  ) { }

  async runOnce(): Promise<void> {
    const job = await this.queue.dequeue()

    if (!job) return

    const result = await executeWithPolicy(job, this.handlers, { maxAttempts: 3 })
    console.log(`[JOB ${job.id}]`, { jobType: job.type, ...result })
  }
}