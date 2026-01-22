import { JobStatus } from '../types/job-status.type'
import { JobType } from '../types/job.type'
import { JobPayloads } from '../types/payloads.type'

export type JobEntity<T extends JobType> = {
  id: string
  type: T
  payload: JobPayloads[T]
  status: JobStatus
  attempts: number
  createdAt: Date
  updatedAt: Date
}
