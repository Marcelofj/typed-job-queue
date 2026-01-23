import type { JobHandler } from '../../types/job-handler.type.js'

export const cleanUpTempFilesHandler: JobHandler<'clean-up-temp-files'> = async payload => {

  const directoryExists = payload.directory.trim().length > 0

  if (!directoryExists) {
    return {
      status: 'failure',
      kind: 'fatal',
      error: { code: 'DIRECTORY_NOT_FOUND' }
    }
  }

  return {
    status: 'success',
    data: {
      scannedFiles: 120,
      deletedFiles: payload.dryRun ? 0 : 87,
      dryRun: payload.dryRun
    }
  }
}