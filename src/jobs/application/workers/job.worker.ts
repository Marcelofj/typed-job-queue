import type { JobHandlers, JobRepository } from '../../domain/index.js'
import type { JobExecutionListener } from '../observability/job-execution-listener.observability.js'
import { executeWithListener } from '../dispatchers/execute-with-listener.dispatcher.js'
import { decideRetry } from '../policies/retry.policy.js'
import type { JobQueue } from '../../domain/queues/job.queue.js'
import { jobExecutionProjection } from '../projections/job-execution.projection.js'
import { executeJob } from '../executions/execute-job.js'


export class JobWorker {
  constructor(
    private readonly repository: JobRepository,
    private readonly queue: JobQueue,
    private readonly handlers: JobHandlers,
    private readonly listener?: JobExecutionListener
  ) { }

  async runOnce(): Promise<void> {

    // 🔹 consome apenas a identidade
    const jobId = await this.queue.dequeue()
    if (!jobId) return

    // 🔹 busca o estado real no repositório
    const jobEntity = await this.repository.claimById(jobId)
    if (!jobEntity) return

    const executionJob = jobExecutionProjection(jobEntity)

    const exec = () => executeJob(
      executionJob,
      this.handlers
    )

    const result = this.listener
      ? await executeWithListener(
        executionJob,
        jobEntity.attempts,
        this.listener,
        exec
      )
      : await exec()

    const decision = decideRetry(result, jobEntity.attempts)

    if (result.status === 'success') {
      jobEntity.status = 'success'
    } else if (decision.action === 'retry') {
      jobEntity.status = 'pending'

      await this.queue.enqueue(jobEntity.id)
    } else {
      jobEntity.status = 'failure'
    }

    jobEntity.updatedAt = new Date()
    await this.repository.update(jobEntity)

    console.log('Job:', JSON.stringify(jobEntity, null, 2))
    console.log('Result:', JSON.stringify(result, null, 2))
    console.log('Decision:', decision)
    console.log('----------------------------------------\n')
  }
}
