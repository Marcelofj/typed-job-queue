import { Job, JobType } from '../../domain/types/job.type'
import { JobPayloads } from '../../domain/types/payloads.type'

export function createJob<T extends JobType>(
  type: T,
  payload: JobPayloads[T]
): Job<T> {
  return {
    id: crypto.randomUUID(),
    type,
    payload
  }
}