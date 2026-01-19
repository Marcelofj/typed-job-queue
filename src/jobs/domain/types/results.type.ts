import { CleanUpTempFilesResult, GenerateReportResult, SendEmailResult } from '../../domain'

// lookup map
export type JobResults = {
  'send-email': SendEmailResult
  'generate-report': GenerateReportResult
  'clean-up-temp-files': CleanUpTempFilesResult
}