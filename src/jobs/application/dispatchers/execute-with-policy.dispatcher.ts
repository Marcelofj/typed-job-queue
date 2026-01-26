import type {
  Job,
  JobType,
  JobHandlers,
  JobExecutionResult,
  JobResults,
  JobErrors
} from '../../domain/index.js'

import { dispatchJob } from './dispatch-job.dispatcher.js'

export type JobExecutionContextOptions = {
  attempt: number
}

/**
 * Executor puro com política aplicada.
 * NÃO conhece observabilidade.
 */
export const executeWithPolicy = async <T extends JobType>(
  job: Job<T>,
  handlers: JobHandlers,
  options: JobExecutionContextOptions,
): Promise<JobExecutionResult<JobResults[T], JobErrors[T]>> => {

  // aqui poderia futuramente entrar timeout, circuit breaker, etc

  return dispatchJob(job, handlers)
}
