import type { JobTelemetryPort } from '../../application/observability/job-telemetry-port.observability'
import type { JobTelemetryEvent } from '../../application/observability/job-telemetry-events.observability'

export class ConsoleTelemetryAdapter implements JobTelemetryPort {
  publish(event: JobTelemetryEvent): void {
    switch (event.type) {
      case 'job-started':
        console.log(
          `[JOB STARTED]`,
          {
            jobId: event.jobId,
            jobType: event.jobType,
            attempt: event.attempt,
            at: event.timestamp
          }
        )
        break

      case 'job-succeeded':
        console.log(
          `[JOB SUCCEEDED]`,
          {
            jobId: event.jobId,
            jobType: event.jobType,
            attempt: event.attempt,
            durationMs: event.durationMs,
            at: event.timestamp
          }
        )
        break

      case 'job-failed':
        console.log(
          `[JOB FAILED]`,
          {
            jobId: event.jobId,
            jobType: event.jobType,
            attempt: event.attempt,
            durationMs: event.durationMs,
            kind: event.kind,
            at: event.timestamp
          }
        )
        break
    }
  }
}
