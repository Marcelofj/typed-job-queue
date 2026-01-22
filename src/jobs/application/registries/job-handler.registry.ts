import { cleanUpTempFilesHandler, generateReportHandler, sendEmailHandler } from '../../domain'
import { JobHandlers } from '../../domain'

export const handlers: JobHandlers = {
  'send-email': sendEmailHandler,
  'generate-report': generateReportHandler,
  'clean-up-temp-files': cleanUpTempFilesHandler
}