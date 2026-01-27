import type {
  Job,
  JobType,
  JobExecutionResult,
  JobResults,
  JobErrors
} from '../../domain/index.js'

import type { JobExecutionListener } from '../observability/job-execution-listener.observability.js'

/**
 * Wrapper de execução observável.
 * Responsável EXCLUSIVAMENTE por telemetria de tentativa.
 * Não conhece handlers, políticas ou filas.
 */
export async function executeWithListener<T extends JobType>(
  job: Job<T>,
  attempt: number,
  listener: JobExecutionListener,
  exec: () => Promise<JobExecutionResult<JobResults[T], JobErrors[T]>>
): Promise<JobExecutionResult<JobResults[T], JobErrors[T]>> {

  const start = Date.now()

  listener.onAttemptStart(job, attempt)

  const result = await exec()

  const durationMs = Date.now() - start

  listener.onAttemptFinish(job, attempt, result, durationMs)

  return result
}
