/**
 * Porta de saída da camada de aplicação para enfileiramento de jobs.
 * Define o contrato mínimo que qualquer adaptador de fila deve cumprir.
 */
export interface JobQueue {
  enqueue(jobId: string): Promise<void>
  dequeue(): Promise<string | undefined>
}
