import {
  Job,
  JobType,
  JobPayloads
} from '../../domain'

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