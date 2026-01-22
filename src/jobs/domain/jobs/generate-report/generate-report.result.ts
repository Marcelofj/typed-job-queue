export type GenerateReportResult = {
  reportId: string
  format: 'pdf' | 'csv'
  downloadUrl: string
}