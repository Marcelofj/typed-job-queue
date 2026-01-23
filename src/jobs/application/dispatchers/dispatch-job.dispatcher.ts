import type {
  JobErrors,
  JobExecutionResult,
  JobHandlers,
  Job,
  JobType,
  JobResults
} from '../../domain/index.js'

export async function dispatchJob<T extends JobType>(
  job: Job<T>,
  handlers: JobHandlers
): Promise<JobExecutionResult<JobResults[T], JobErrors[T]>> {
  const handler = handlers[job.type]
  return await handler(job.payload)
}
