import type {
  JobErrors,
  JobExecutionResult,
  JobHandlers,
  Job,
  JobType,
  JobResults
} from '../../domain/index.js'

export async function dispatchJob<T extends JobType>(
  job: Job<T>,
  handlers: JobHandlers
): Promise<JobExecutionResult<JobResults[T], JobErrors[T]>> {

  const handler = handlers[job.type]

  // Estado impossível por contrato de tipos (handlers deve estar completo)
  if (!handler) {
    // estado impossível por contrato → falha fatal padronizada
    return {
      status: 'failure',
      kind: 'fatal',
      error: {} as JobErrors[T]
    }
  }

  // 🔹 handler já retorna JobExecutionResult
  return handler(job.payload)
}
