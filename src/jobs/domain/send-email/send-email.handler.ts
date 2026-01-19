import { JobHandler } from '../types/handlers.type'

export const sendEmailHandler: JobHandler<'send-email'> = async payload => {

  const hasRecipient = (to: string) => to.trim().length > 0

  const classifyFailure = (): 'fatal' => 'fatal'

  const generateMessageId = () => crypto.randomUUID()

  const now = () => new Date()

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


  if (!hasRecipient(payload.to)) {
    return failure({ code: 'RECIPIENT_NOT_FOUND' })
  }

  return success({
    messageId: generateMessageId(),
    queuedAt: now()
  })
}
