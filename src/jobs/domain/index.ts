// Barrel Export
// ENTITIES
export type { JobEntity } from './entities/job.entity'

// JOBS
export type {
  SendEmailPayload,
  SendEmailResult,
  SendEmailError
} from './jobs/send-email'

export {
  sendEmailHandler
} from './jobs/send-email'

export type {
  GenerateReportPayload,
  GenerateReportResult,
  GenerateReportError
} from './jobs/generate-report'

export {
  generateReportHandler
} from './jobs/generate-report'

export type {
  CleanUpTempFilesPayload,
  CleanUpTempFilesResult,
  CleanUpTempFilesError
} from './jobs/clean-up-temp-files'

export {
  cleanUpTempFilesHandler
} from './jobs/clean-up-temp-files'

// TYPES
export type { JobErrors } from './types/errors.type'

export type {
  FailureKind,
  ExecutionSuccess,
  ExecutionFailure,
  ExecutionResult
} from './types/execution.type'

export type {
  JobHandler,
  JobHandlers
} from './types/handler.type'

export type { JobStatus } from './types/job-status.type'

export type {
  JobType,
  Job
} from './types/job.type'

export type { JobPayloads } from './types/payloads.type'

export type { JobResults } from './types/results.type'

