import type {
  Job,
  JobType,
  JobExecutionResult,
  JobResults,
  JobErrors
} from '../../domain/index.js'

import type { JobExecutionObserver } from '../observability/job-execution-observer.observability.js'

/**
 * Wrapper de execução observável.
 * Responsável EXCLUSIVAMENTE por telemetria de tentativa.
 * Não conhece handlers, políticas ou filas.
 */
export async function executeObserved<T extends JobType>(
  job: Job<T>,
  attempt: number,
  observer: JobExecutionObserver,
  exec: () => Promise<JobExecutionResult<JobResults[T], JobErrors[T]>>
): Promise<JobExecutionResult<JobResults[T], JobErrors[T]>> {

  const start = Date.now()

  observer.onAttemptStart(job, attempt)

  const result = await exec()

  const durationMs = Date.now() - start

  observer.onAttemptFinish(job, attempt, result, durationMs)

  return result
}
