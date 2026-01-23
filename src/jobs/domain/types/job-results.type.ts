import type { CleanUpTempFilesResult } from '../jobs/clean-up-temp-files/index.js'
import type { GenerateReportResult } from '../jobs/generate-report/index.js'
import type { SendEmailResult } from '../jobs/send-email/index.js'

// lookup map - type map
export type JobResults = {
  'send-email': SendEmailResult
  'generate-report': GenerateReportResult
  'clean-up-temp-files': CleanUpTempFilesResult
}