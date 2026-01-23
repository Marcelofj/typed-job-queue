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

  // Guarda de tipo necessária com noUncheckedIndexedAccess: true
  if (!handler) {
    throw new Error(
      `No handler registered for job type: ${job.type}. ` +
      `Available handlers: ${Object.keys(handlers).join(', ')}`
    )
  }

  return await handler(job.payload)
}