import { CleanUpTempFilesError, GenerateReportError, SendEmailError } from '../../domain'

// lookup map
export type JobErrors = {
  'send-email': SendEmailError
  'generate-report': GenerateReportError
  'clean-up-temp-files': CleanUpTempFilesError
}