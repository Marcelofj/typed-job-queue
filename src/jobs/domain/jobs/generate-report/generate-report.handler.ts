import { randomUUID } from 'node:crypto'
import type { JobHandler } from '../../types/job-handler.type.js'

export const generateReportHandler: JobHandler<'generate-report'> = async payload => {
  const userExists = payload.userId.trim().length > 0

  if (!userExists) {
    return {
      status: 'failure',
      kind: 'fatal',
      error: { code: 'USER_NOT_FOUND' }
    }
  }

  return {
    status: 'success',
    data: {
      reportId: randomUUID(),
      format: payload.format,
      downloadUrl: `https://reports.local/${payload.userId}`
    }
  }
}