import type { ExecutionResult } from '../../domain'

export type RetryDecision =
  | { action: 'retry'; delayMs: number }
  | { action: 'discard' }

export function decideRetry(
  result: ExecutionResult<any, any>,
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
    action: 'retry',
    delayMs: attempt * 1000
  }
}
