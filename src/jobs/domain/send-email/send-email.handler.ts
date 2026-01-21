import { JobHandler } from '../types/handler.type'

export const sendEmailHandler: JobHandler<'send-email'> = async payload => {

  const recipientExists = payload.to.trim().length > 0

  if (!recipientExists) {
    return {
      status: 'failure',
      kind: 'fatal',
      error: { code: 'RECIPIENT_NOT_FOUND' }
    }
  }
  return {
    status: 'success',
    data: {
      messageId: crypto.randomUUID(),
      queuedAt: new Date()
    }
  }
}