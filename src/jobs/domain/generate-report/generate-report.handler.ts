// import { JobHandler } from '../types/handlers.type'

// export const generateReportHandler: JobHandler<'generate-report'> = async payload => {
//   const userExists = payload.userId !== '0' && payload.userId !== ''

//   if (!userExists) {
//     return {
//       status: 'failure',
//       kind: 'fatal',
//       error: { code: 'USER_NOT_FOUND' }
//     }
//   }

//   return {
//     status: 'success',
//     data: {
//       reportId: crypto.randomUUID(),
//       format: payload.format,
//       downloadUrl: `https://reports.local/${payload.userId}`
//     }
//   }
// }

import { JobHandler } from '../types/handler.type'

export const generateReportHandler: JobHandler<'generate-report'> = async payload => {

  const hasUser = (user: string) => user !== '0' && user.length > 0

  const classifyFailure = (): 'fatal' => 'fatal'

  const generateReportId = () => crypto.randomUUID()

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

  if (!hasUser(payload.userId)) {
    return failure({ code: 'USER_NOT_FOUND' })
  }

  return success({
    reportId: generateReportId(),
    format: payload.format,
    downloadUrl: `https://reports.local/${payload.userId}`
  })
}