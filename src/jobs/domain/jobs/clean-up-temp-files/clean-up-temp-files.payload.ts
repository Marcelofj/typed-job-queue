export type CleanUpTempFilesPayload = {
  directory: string
  maxAgeInDays: number
  dryRun: boolean
}