import {
  JobErrors,
  ExecutionResult,
  JobHandlers,
  Job,
  JobType,
  JobResults
} from '../../domain'

export async function dispatchJob<T extends JobType>(
  job: Job<T>,
  handlers: JobHandlers
): Promise<ExecutionResult<JobResults[T], JobErrors[T]>> {
  const handler = handlers[job.type]
  return await handler(job.payload)
}
