import {
  cleanUpTempFilesHandler,
  generateReportHandler,
  sendEmailHandler
} from '../../domain/index.js'

import type { JobHandlers } from '../../domain/index.js'

export const handlers: JobHandlers = {
  'send-email': sendEmailHandler,
  'generate-report': generateReportHandler,
  'clean-up-temp-files': cleanUpTempFilesHandler
}