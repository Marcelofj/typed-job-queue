// Barrel Export
// DISPATCHERS
export { dispatchJob } from './dispatchers/dispatch-job.dispatcher'
export { executeWithPolicy } from './dispatchers/execution-context.dispatcher'

// FACTORIES
export { createJob } from './factories/create-job.factory'

// OBSERVABILITY
export type {
  BaseJobTelemetryEvent,
  JobStartedEvent,
  JobSucceededEvent,
  JobFailedEvent,
  JobTelemetryEvent
} from './observability/job-telemetry-events.observability'
export { ExecutionObserver } from './observability/execution-observer.observability'
export { JobTelemetryPort } from './observability/job-telemetry-port.observability'
export { ExecutionMetricsContext } from './observability/execution-metrics-context.observability'

// POLICIES
export type { FailureKind } from './policies/failure-classification.policy'
export type { RetryDecision } from './policies/retry.policy'
export { decideRetry } from './policies/retry.policy'

// REGISTRIES
export { handlers } from './registries/job-handler.registry'

// WORKERS
export { JobWorker } from './workers/job.worker'


