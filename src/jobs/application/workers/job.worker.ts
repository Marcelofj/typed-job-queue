import type { JobHandlers, JobRepository } from '../../domain/index.js'
import type { JobExecutionObserver } from '../observability/job-execution-observer.observability.js'
import { executeWithPolicy } from '../dispatchers/execute-with-policy.dispatcher.js'
import { executeObserved } from '../dispatchers/execute-observed.dispatcher.js'
import { decideRetry } from '../policies/retry.policy.js'
import type { JobQueue } from '../queues/job.queue.js'


export class JobWorker {
  constructor(
    private readonly repository: JobRepository,
    private readonly queue: JobQueue,
    private readonly handlers: JobHandlers,
    private readonly observer?: JobExecutionObserver
  ) { }

  async runOnce(): Promise<void> {

    // 🔹 consome apenas a identidade
    const jobId = await this.queue.dequeue()
    if (!jobId) return

    // 🔹 busca o estado real no repositório
    const job = await this.repository.claimById(jobId)
    if (!job) return

    const exec = () =>
      executeWithPolicy(
        job,
        this.handlers,
        { attempt: job.attempts }
      )

    const result = this.observer
      ? await executeObserved(
        job,
        job.attempts,
        this.observer,
        exec
      )
      : await exec()

    const decision = decideRetry(result, job.attempts)

    if (result.status === 'success') {
      job.status = 'success'
    } else if (decision.action === 'retry') {
      job.status = 'pending'

      await this.queue.enqueue(job.id)
    } else {
      job.status = 'failure'
    }

    job.updatedAt = new Date()
    await this.repository.update(job)

    console.log('Job:', JSON.stringify(job, null, 2))
    console.log('Result:', JSON.stringify(result, null, 2))
    console.log('Decision:', decision)
    console.log('----------------------------------------\n')
  }
}
