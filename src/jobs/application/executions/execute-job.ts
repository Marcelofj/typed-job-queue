import type { Job, JobType } from '../../domain/index.js'
import type { JobHandlers } from '../../domain/index.js'
import { executeWithPolicy } from '../dispatchers/execute-with-policy.dispatcher.js'

export async function executeJob<T extends JobType>(
  job: Job<T>,
  handlers: JobHandlers
) {
  return executeWithPolicy(job, handlers)
}
