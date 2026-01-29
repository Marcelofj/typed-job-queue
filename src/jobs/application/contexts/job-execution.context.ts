import type { Job, JobType } from '../../domain/index.js'

export interface JobExecutionContext<T extends JobType> {
  job: Job<T>
  attempt: number
}
