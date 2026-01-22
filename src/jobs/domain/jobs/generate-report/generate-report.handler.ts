import { JobHandler } from '../../types/handler.type'

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
      reportId: crypto.randomUUID(),
      format: payload.format,
      downloadUrl: `https://reports.local/${payload.userId}`
    }
  }
}