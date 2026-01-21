// string literal union type
export type FailureKind =
  | 'fatal'
  | 'retryable'

// object type
export type ExecutionSuccess<T> = {
  status: 'success'
  data: T
}

// object type
export type ExecutionFailure<E> = {
  status: 'failure'
  kind: FailureKind
  error: E
}

// discriminated union type - tagged union
export type ExecutionResult<T, E> =
  | ExecutionSuccess<T>
  | ExecutionFailure<E>