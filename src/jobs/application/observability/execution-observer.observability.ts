import type { Job } from '../../domain/types/job.type'
import type { ExecutionResult } from '../../domain/types/execution.type'
import type { JobType } from '../../domain/types/job.type'

export interface ExecutionObserver {
  onAttemptStart<T extends JobType>(job: Job<T>, attempt: number): void
  onAttemptFinish<T extends JobType, R, E>(
    job: Job<T>,
    attempt: number,
    result: ExecutionResult<R, E>,
    durationMs: number
  ): void
}
