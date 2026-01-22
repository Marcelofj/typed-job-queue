import type { JobQueue } from '../../infrastructure/queues/job.queue'
import type { JobHandlers } from '../../domain'
import type { JobTelemetryPort } from '../observability/job-telemetry-port.observability'
import { executeWithPolicy } from '../dispatchers/execution-context.dispatcher'
import { ExecutionMetricsContext } from '../observability/execution-metrics-context.observability'

export class JobWorker {

  private metrics: ExecutionMetricsContext

  constructor(
    private queue: JobQueue,
    private handlers: JobHandlers,
    telemetry: JobTelemetryPort
  ) {
    this.metrics = new ExecutionMetricsContext(telemetry)
  }

  async runOnce(): Promise<void> {
    const job = await this.queue.dequeue()
    if (!job) return

    await executeWithPolicy(job, this.handlers, {
      maxAttempts: 3,
      observer: this.metrics
    })
  }
}
