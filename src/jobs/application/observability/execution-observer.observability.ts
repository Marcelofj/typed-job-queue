import type {
  Job,
  JobExecutionResult,
  JobType
} from '../../domain/index.js'

export interface ExecutionObserver {
  onAttemptStart<T extends JobType>(job: Job<T>, attempt: number): void
  onAttemptFinish<T extends JobType, R, E>(
    job: Job<T>,
    attempt: number,
    result: JobExecutionResult<R, E>,
    durationMs: number
  ): void
}
