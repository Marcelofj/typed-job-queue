import type { JobStatus } from '../types/job-status.type.js'
import type { JobType } from '../types/job.type.js'
import type { JobPayloads } from '../types/job-payloads.type.js'

export type JobEntity<T extends JobType> = {
  id: string
  type: T
  payload: JobPayloads[T]
  status: JobStatus
  attempts: number
  createdAt: Date
  updatedAt: Date
}