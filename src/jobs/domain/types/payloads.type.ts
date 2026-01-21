import { CleanUpTempFilesPayload, GenerateReportPayload, SendEmailPayload } from '../../domain'

// lookup map - type map
export type JobPayloads = {
  'send-email': SendEmailPayload
  'generate-report': GenerateReportPayload
  'clean-up-temp-files': CleanUpTempFilesPayload
}