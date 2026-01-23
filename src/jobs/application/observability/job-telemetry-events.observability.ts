import type {
  JobType,
  JobFailureKind
} from '../../domain/index.js'

/**
 * Base comum para todos os eventos de telemetria de jobs.
 * Garante identidade, rastreabilidade e contexto mínimo.
 */
export type BaseJobTelemetryEvent = {
  jobId: string
  jobType: JobType
  attempt: number
  timestamp: Date
}

/**
 * Emitido quando a execução de um job é iniciada.
 */
export type JobStartedEvent = BaseJobTelemetryEvent & {
  type: 'job-started'
}

/**
 * Emitido quando um job é concluído com sucesso.
 */
export type JobSucceededEvent = BaseJobTelemetryEvent & {
  type: 'job-succeeded'
  durationMs: number
}

/**
 * Emitido quando um job falha.
 */
export type JobFailedEvent = BaseJobTelemetryEvent & {
  type: 'job-failed'
  durationMs: number
  kind: JobFailureKind
}

/**
 * União discriminada de todos os eventos possíveis de telemetria de jobs.
 * Esse tipo representa o contrato oficial da camada de observabilidade.
 */
export type JobTelemetryEvent =
  | JobStartedEvent
  | JobSucceededEvent
  | JobFailedEvent
