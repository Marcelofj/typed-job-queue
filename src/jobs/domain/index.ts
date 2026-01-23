// Barrel Export
// ENTITIES
export type { JobEntity } from './entities/job.entity.js'

// JOBS
export type {
  SendEmailPayload,
  SendEmailResult,
  SendEmailError
} from './jobs/send-email/index.js'

export {
  sendEmailHandler
} from './jobs/send-email/index.js'

export type {
  GenerateReportPayload,
  GenerateReportResult,
  GenerateReportError
} from './jobs/generate-report/index.js'

export {
  generateReportHandler
} from './jobs/generate-report/index.js'

export type {
  CleanUpTempFilesPayload,
  CleanUpTempFilesResult,
  CleanUpTempFilesError
} from './jobs/clean-up-temp-files/index.js'

export {
  cleanUpTempFilesHandler
} from './jobs/clean-up-temp-files/index.js'

// TYPES
export type { JobErrors } from './types/job-errors.type.js'

export type {
  JobExecutionSuccess,
  JobExecutionFailure,
  JobExecutionResult
} from './types/job-execution.type.js'

export type { JobFailureKind } from './types/job-failure-kind.type.js'

export type {
  JobHandler,
  JobHandlers
} from './types/job-handler.type.js'

export type { JobStatus } from './types/job-status.type.js'

export type {
  JobType,
  Job
} from './types/job.type.js'

export type { JobPayloads } from './types/job-payloads.type.js'

export type { JobResults } from './types/job-results.type.js'

// REPOSITORIES
export type { JobRepository } from './repositories/job-repository.port.js'

