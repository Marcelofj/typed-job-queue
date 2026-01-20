import type { Job, JobType } from '../../domain/types/job.type'
import type { JobHandlers } from '../../domain/types/handler.type'
import type { ExecutionResult } from '../../domain/types/execution.type'
import { dispatchJob } from './dispatch-job.dispatcher'
import { decideRetry } from '../policies/retry.policy'
import type { ExecutionObserver } from '../observability/execution-observer.observability'

type ExecutionContextOptions = {
  maxAttempts: number
  observer?: ExecutionObserver
}

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export const executeWithPolicy = async <T extends JobType>(
  job: Job<T>,
  handlers: JobHandlers,
  options: ExecutionContextOptions,
): Promise<ExecutionResult<any, any>> => {

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
