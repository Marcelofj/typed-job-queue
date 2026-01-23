import type {
  JobRepository,
  JobEntity,
  JobStatus
} from '../../domain/index.js'

export class InMemoryJobRepository implements JobRepository {
  private jobs: JobEntity<any>[] = []

  async save(job: JobEntity<any>): Promise<void> {
    this.jobs.push(job)
  }

  async update(job: JobEntity<any>): Promise<void> {
    const index = this.jobs.findIndex(j => j.id === job.id)
    if (index >= 0) {
      this.jobs[index] = job
    }
  }

  async findById(id: string): Promise<JobEntity<any> | null> {
    return this.jobs.find(j => j.id === id) ?? null
  }

  async findNextPending(): Promise<JobEntity<any> | null> {
    return this.jobs.find(j => j.status === 'pending') ?? null
  }

  async findByStatus(status: JobStatus): Promise<JobEntity<any>[]> {
    return this.jobs.filter(j => j.status === status)
  }
}
