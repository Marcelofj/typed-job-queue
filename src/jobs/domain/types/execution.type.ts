export type FailureKind =
  | 'fatal'
  | 'retryable'


export type ExecutionSuccess<T> = {
  status: 'success'
  data: T
}

export type ExecutionFailure<E> = {
  status: 'failure'
  kind: FailureKind
  error: E
}

export type ExecutionResult<T, E> =
  | ExecutionSuccess<T>
  | ExecutionFailure<E>