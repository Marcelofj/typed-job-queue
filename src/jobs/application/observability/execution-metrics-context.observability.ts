import type { ExecutionObserver } from './execution-observer.observability'
import type {
  Job,
  ExecutionResult,
  JobType
} from '../../domain'
import type { JobTelemetryPort } from './job-telemetry-port.observability'

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
    result: ExecutionResult<R, E>,
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
