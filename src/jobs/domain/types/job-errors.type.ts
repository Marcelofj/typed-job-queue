import type { CleanUpTempFilesError } from '../jobs/clean-up-temp-files/index.js'
import type { GenerateReportError } from '../jobs/generate-report/index.js'
import type { SendEmailError } from '../jobs/send-email/index.js'

// lookup map - type map
export type JobErrors = {
  'send-email': SendEmailError
  'generate-report': GenerateReportError
  'clean-up-temp-files': CleanUpTempFilesError
}