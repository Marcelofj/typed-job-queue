export type GenerateReportError =
  | { code: 'USER_NOT_FOUND' }
  | { code: 'UNSUPPORTED_FORMAT' }