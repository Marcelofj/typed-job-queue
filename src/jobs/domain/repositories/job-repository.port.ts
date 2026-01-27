import type { JobEntity } from '../entities/job.entity.js'

export interface JobRepository {
  save(job: JobEntity<any>): Promise<void>
  update(job: JobEntity<any>): Promise<void>
  findById(id: string): Promise<JobEntity<any> | null>
  // Deve ser uma operação atômica (claim + transição para running)
  claimById(id: string): Promise<JobEntity<any> | null>
}

