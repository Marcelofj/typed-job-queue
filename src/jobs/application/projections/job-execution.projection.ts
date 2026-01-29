import type { Job, JobType } from '../../domain/index.js'
import type { JobEntity } from '../../domain/entities/job.entity.js'

export function jobExecutionProjection<T extends JobType>(
  entity: JobEntity<T>
): Job<T> {
  return {
    id: entity.id,
    type: entity.type,
    payload: entity.payload
  }
}
