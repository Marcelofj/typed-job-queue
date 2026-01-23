import type { JobTelemetryEvent } from './job-telemetry-events.observability.js'

/**
 * Porta de saída da camada de aplicação para telemetria de jobs.
 * Define o contrato mínimo que qualquer adaptador de observabilidade deve cumprir.
 */
export interface JobTelemetryPort {
  publish(event: JobTelemetryEvent): void | Promise<void>
}
