import type {
  Job,
  JobType,
  JobHandlers,
  JobExecutionResult
} from '../../domain/index.js'
import { dispatchJob } from './dispatch-job.dispatcher.js'
import { decideRetry } from '../policies/retry.policy.js'
import type { JobExecutionObserver } from '../observability/job-execution-observer.observability.js'

type ExecutionContextOptions = {
  maxAttempts: number
  observer?: JobExecutionObserver
}

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export const executeWithPolicy = async <T extends JobType>(
  job: Job<T>,
  handlers: JobHandlers,
  options: ExecutionContextOptions,
): Promise<JobExecutionResult<any, any>> => {

  let attempt = 1

  while (attempt <= options.maxAttempts) {
    const start = Date.now()

    options.observer?.onAttemptStart(job, attempt)

    const result = await dispatchJob(job, handlers)

    const durationMs = Date.now() - start

    options.observer?.onAttemptFinish(job, attempt, result, durationMs)

    const decision = decideRetry(result, attempt)

    if (decision.action === 'discard') {
      return result
    }

    await delay(decision.delayMs)
    attempt++
  }

  throw new Error('Unreachable state in execution context')
}
