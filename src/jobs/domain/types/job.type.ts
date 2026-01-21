import { JobPayloads } from './payloads.type'

// string literal union type
export type JobType =
  | 'send-email'
  | 'generate-report'
  | 'clean-up-temp-files'

// object type
export type Job<T extends JobType> = {
  id: string
  type: T
  payload: JobPayloads[T]
}
