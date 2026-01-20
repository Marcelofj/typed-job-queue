import { JobErrors } from '../../domain/types/errors.type'
import { ExecutionResult } from '../../domain/types/execution.type'
import { JobHandlers } from '../../domain/types/handler.type'
import { Job, JobType } from '../../domain/types/job.type'
import { JobResults } from '../../domain/types/results.type'

export async function dispatchJob<T extends JobType>(
  job: Job<T>,
  handlers: JobHandlers
): Promise<ExecutionResult<JobResults[T], JobErrors[T]>> {
  const handler = handlers[job.type]
  return await handler(job.payload)
}
