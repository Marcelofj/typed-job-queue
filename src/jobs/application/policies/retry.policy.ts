import type { JobExecutionResult } from '../../domain/index.js'

export type RetryDecision =
  | { action: 'retry' }
  | { action: 'discard' }

export function decideRetry<T, E>(
  result: JobExecutionResult<T, E>,
  attempt: number
): RetryDecision {
  if (result.status === 'success') {
    return { action: 'discard' }
  }

  if (result.kind === 'fatal') {
    return { action: 'discard' }
  }

  // retryable
  if (attempt >= 3) {
    return { action: 'discard' }
  }

  return {
    action: 'retry'
  }
}
