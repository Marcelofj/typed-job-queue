import { JobHandler } from '../types/handler.type'

// export const cleanUpTempFilesHandler: JobHandler<'clean-up-temp-files'> = async payload => {

//   const directoryExists = payload.directory !== ''

//   if (!directoryExists) {
//     return {
//       status: 'failure',
//       kind: 'fatal',
//       error: { code: 'DIRECTORY_NOT_FOUND' }
//     }
//   }

//   return {
//     status: 'success',
//     data: {
//       scannedFiles: 120,
//       deletedFiles: payload.dryRun ? 0 : 87,
//       dryRun: payload.dryRun
//     }
//   }
// }

export const cleanUpTempFilesHandler: JobHandler<'clean-up-temp-files'> = async payload => {

  const hasDirectory = (path: string) => path.trim().length > 0

  const classifyFailure = (): 'fatal' => 'fatal'

  const scanFiles = (quantity: number) => quantity

  const deleteFiles = (quantity: number) => payload.dryRun ? 0 : quantity

  const failure = <E>(error: E): { status: 'failure', kind: 'fatal', error: E } =>
  ({
    status: 'failure',
    kind: classifyFailure(),
    error

  })

  const success = <T>(data: T): { status: 'success', data: T } =>
  ({
    status: 'success',
    data
  })


  if (!hasDirectory(payload.directory)) {
    return failure({ code: 'DIRECTORY_NOT_FOUND' })
  }

  return success({
    scannedFiles: scanFiles(120),
    deletedFiles: deleteFiles(92),
    dryRun: payload.dryRun
  })
}