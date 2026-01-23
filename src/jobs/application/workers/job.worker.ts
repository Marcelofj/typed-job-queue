import type { JobHandlers, JobRepository } from '../../domain/index.js'
import type { JobExecutionObserver } from '../observability/job-execution-observer.observability.js'
import { executeWithPolicy } from '../dispatchers/execute-with-policy.dispatcher.js'

export class JobWorker {
  constructor(
    private readonly repository: JobRepository,
    private readonly handlers: JobHandlers,
    private readonly observer?: JobExecutionObserver
  ) { }

  async runOnce(): Promise<void> {
    const job = await this.repository.findNextPending()

    if (!job) return

    // marca como running e incrementa tentativas
    job.status = 'running'
    job.attempts++
    job.updatedAt = new Date()
    await this.repository.update(job)

    const result = await executeWithPolicy(job, this.handlers, {
      maxAttempts: 3,
      ...(this.observer && { observer: this.observer })  // ← só adiciona se existir
    })

    if (result.status === 'success') {
      job.status = 'success'
    } else {
      job.status = 'failure'
    }

    job.updatedAt = new Date()
    await this.repository.update(job)

    console.log(`[JOB ${job.id} - ${job.type}]`, result.status)
  }
}