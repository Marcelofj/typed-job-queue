import type {
  JobRepository,
  JobEntity
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

  async claimById(id: string): Promise<JobEntity<any> | null> {
    const job = this.jobs.find(j => j.id === id)

    if (!job) return null
    if (job.status !== 'pending') return null

    job.status = 'running'
    job.attempts++
    job.updatedAt = new Date()

    return job
  }
}
