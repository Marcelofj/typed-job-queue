import type { ExecutionObserver } from './execution-observer.observability.js'
import type {
  Job,
  JobExecutionResult,
  JobType
} from '../../domain/index.js'

import type { JobTelemetryPort } from './job-telemetry-port.observability.js'

export class ExecutionMetricsContext implements ExecutionObserver {

  constructor(private telemetry: JobTelemetryPort) { }

  onAttemptStart<T extends JobType>(job: Job<T>, attempt: number): void {
    this.telemetry.publish({
      type: 'job-started',
      jobId: job.id,
      jobType: job.type,
      attempt,
      timestamp: new Date()
    })
  }

  onAttemptFinish<T extends JobType, R, E>(
    job: Job<T>,
    attempt: number,
    result: JobExecutionResult<R, E>,
    durationMs: number
  ): void {

    if (result.status === 'success') {
      this.telemetry.publish({
        type: 'job-succeeded',
        jobId: job.id,
        jobType: job.type,
        attempt,
        durationMs,
        timestamp: new Date()
      })
    } else {
      this.telemetry.publish({
        type: 'job-failed',
        jobId: job.id,
        jobType: job.type,
        attempt,
        durationMs,
        kind: result.kind,
        timestamp: new Date()
      })
    }
  }
}
