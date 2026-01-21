import { JobErrors } from './errors.type'
import { ExecutionResult } from './execution.type'
import { JobType } from './job.type'
import { JobPayloads } from './payloads.type'
import { JobResults } from './results.type'

// function type expression
export type JobHandler<T extends JobType> = (
  payload: JobPayloads[T]
) => Promise<ExecutionResult<JobResults[T], JobErrors[T]>>

// mapped type
export type JobHandlers = {
  [K in JobType]: JobHandler<K>
}