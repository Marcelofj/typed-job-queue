import type {
  Job,
  ExecutionResult,
  JobType
} from '../../domain'

export interface ExecutionObserver {
  onAttemptStart<T extends JobType>(job: Job<T>, attempt: number): void
  onAttemptFinish<T extends JobType, R, E>(
    job: Job<T>,
    attempt: number,
    result: ExecutionResult<R, E>,
    durationMs: number
  ): void
}
