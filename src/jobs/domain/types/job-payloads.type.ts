import type { CleanUpTempFilesPayload } from '../jobs/clean-up-temp-files/index.js'
import type { GenerateReportPayload } from '../jobs/generate-report/index.js'
import type { SendEmailPayload } from '../jobs/send-email/index.js'

// lookup map - type map
export type JobPayloads = {
  'send-email': SendEmailPayload
  'generate-report': GenerateReportPayload
  'clean-up-temp-files': CleanUpTempFilesPayload
}