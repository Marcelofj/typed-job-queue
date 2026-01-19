import { CleanUpTempFilesPayload, GenerateReportPayload, SendEmailPayload } from '../../domain'

// lookup map
export type JobPayloads = {
  'send-email': SendEmailPayload
  'generate-report': GenerateReportPayload
  'clean-up-temp-files': CleanUpTempFilesPayload
}