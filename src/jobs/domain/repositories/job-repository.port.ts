import type { JobEntity } from '../entities/job.entity.js'
import type { JobStatus } from '../types/job-status.type.js'

export interface JobRepository {
  save(job: JobEntity<any>): Promise<void>
  update(job: JobEntity<any>): Promise<void>
  findById(id: string): Promise<JobEntity<any> | null>
  claimById(id: string): Promise<JobEntity<any> | null>
  findNextPending(): Promise<JobEntity<any> | null>
  claimNextPending(): Promise<JobEntity<any> | null>
  findByStatus(status: JobStatus): Promise<JobEntity<any>[]>
}

