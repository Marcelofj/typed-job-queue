import type { JobFailureKind } from './job-failure-kind.type.js'

// object type
export type JobExecutionSuccess<T> = {
  status: 'success'
  data: T
}

// object type
export type JobExecutionFailure<E> = {
  status: 'failure'
  kind: JobFailureKind
  error: E
}

// discriminated union type - tagged union
export type JobExecutionResult<T, E> =
  | JobExecutionSuccess<T>
  | JobExecutionFailure<E>