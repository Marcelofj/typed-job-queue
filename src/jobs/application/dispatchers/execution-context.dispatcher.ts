import type { Job, JobType } from '../../domain/types/job.type'
import type { JobHandlers } from '../../domain/types/handlers.type'
import type { ExecutionResult } from '../../domain/types/execution.type'
import { dispatchJob } from './dispatch-job.dispatcher'
import { decideRetry } from '../policies/retry.policy'

type ExecutionContextOptions = {
  maxAttempts: number
}

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export const executeWithPolicy = async <T extends JobType>(
  job: Job<T>,
  handlers: JobHandlers,
  options: ExecutionContextOptions,
): Promise<ExecutionResult<any, any>> => {
  let attempt = 1

  while (attempt <= options.maxAttempts) {
    const result = await dispatchJob(job, handlers)

    const decision = decideRetry(result, attempt)

    if (decision.action === 'discard') {
      return result
    }

    await delay(decision.delayMs)
    attempt++
  }

  throw new Error('Unreachable state in execution context')
}

