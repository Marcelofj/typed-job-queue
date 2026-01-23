import type { JobErrors } from './job-errors.type.js'
import type { JobExecutionResult } from './job-execution.type.js'
import type { JobType } from './job.type.js'
import type { JobPayloads } from './job-payloads.type.js'
import type { JobResults } from './job-results.type.js'

// function type expression
export type JobHandler<T extends JobType> = (
  payload: JobPayloads[T]
) => Promise<JobExecutionResult<JobResults[T], JobErrors[T]>>

// mapped type
export type JobHandlers = {
  [K in JobType]: JobHandler<K>
}