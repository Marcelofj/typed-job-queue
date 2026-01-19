# Sistema de Jobs Tipado em TypeScript (Documentação Consolidada)

Esta documentação descreve os **conceitos**, **padrões** e **exemplos reais** usados no projeto de estudo de **TypeScript + Node.js**, cobrindo **do Dia 1 ao Dia 3**.

O foco do projeto é:
- escrever código diariamente
- usar TypeScript de forma **idiomática**
- tratar tipos como **contratos de execução**

---

## 1. Objetivo do Projeto

Construir um sistema de execução de *jobs* em backend usando:

- Node.js
- TypeScript idiomático
- Inferência total de tipos
- Zero `if`, `switch` ou casts
- Zero validação de tipo em runtime
- Arquitetura escalável e manutenível

---

## 2. JobType (String Literal Union)

Define **todas as intenções possíveis** do sistema.

```ts
export type JobType =
  | 'send-email'
  | 'generate-report'
  | 'clean-up-temp-files'
```

📌 *Jobs representam intenções de domínio, não implementações técnicas.*

---

## 3. Payloads Separados por Job

Cada job possui seu próprio payload, definido em arquivo independente.

### SendEmailPayload

```ts
export type SendEmailPayload = {
  to: string
  subject: string
  body: string
}
```

### GenerateReportPayload

```ts
export type GenerateReportPayload = {
  userId: string
  format: 'pdf' | 'csv'
}
```

### CleanUpTempFilesPayload

```ts
export type CleanUpTempFilesPayload = {
  directory: string
  maxAgeInDays: number
  dryRun: boolean
}
```

---

## 4. Lookup Map — JobPayloads

### Conceito

Um **lookup map** associa cada `JobType` ao tipo correto de payload.

> Nome usado pela comunidade.
> Feature oficial envolvida: **Indexed Access Types**.

```ts
export type JobPayloads = {
  'send-email': SendEmailPayload
  'generate-report': GenerateReportPayload
  'clean-up-temp-files': CleanUpTempFilesPayload
}
```

Uso:

```ts
JobPayloads[T]
```

📌 O tipo do payload **depende diretamente** do tipo do job.

---

## 5. Job<T>

Representa uma instância concreta de um job.

```ts
export type Job<T extends JobType> = {
  id: string
  type: T
  payload: JobPayloads[T]
}
```

### Propriedades importantes

- `T` é inferido automaticamente
- `payload` é estritamente compatível com `type`

---

## 6. createJob — Inferência Total

```ts
export function createJob<T extends JobType>(
  type: T,
  payload: JobPayloads[T]
): Job<T> {
  return {
    id: crypto.randomUUID(),
    type,
    payload
  }
}
```

### Benefícios

- Nenhum cast
- Nenhuma validação manual
- Erros detectados em tempo de compilação

---

## 7. JobHandler<T> — Dia 2

Contrato de execução de um job.

```ts
export type JobHandler<T extends JobType> = (
  payload: JobPayloads[T]
) => Promise<void>
```

📌 Cada handler conhece exatamente o payload que recebe.

---

## 8. Handlers Concretos (Dia 2)

### send-email.handler.ts

```ts
export const sendEmailHandler: JobHandler<'send-email'> = async payload => {
  payload.to
  payload.subject
  payload.body
}
```

### generate-report.handler.ts

```ts
export const generateReportHandler: JobHandler<'generate-report'> = async payload => {
  payload.userId
  payload.format
}
```

### clean-up-temp-files.handler.ts

```ts
export const cleanUpTempFilesHandler: JobHandler<'clean-up-temp-files'> = async payload => {
  payload.directory
  payload.maxAgeInDays
  payload.dryRun
}
```

---

## 9. Mapped Types — JobHandlers

### Conceito oficial do TypeScript

Um **Mapped Type** cria tipos dinamicamente a partir de uma união.

```ts
export type JobHandlers = {
  [K in JobType]: JobHandler<K>
}
```

📘 Termo oficial: **Mapped Types**

---

## 10. Registro de Handlers

```ts
export const handlers: JobHandlers = {
  'send-email': sendEmailHandler,
  'generate-report': generateReportHandler,
  'clean-up-temp-files': cleanUpTempFilesHandler
}
```

📌 Se faltar ou sobrar um handler, o TypeScript acusa erro.

---

## 11. Dispatcher — Dia 2

```ts
export async function dispatchJob<T extends JobType>(
  job: Job<T>,
  handlers: JobHandlers
): Promise<void> {
  const handler = handlers[job.type]
  await handler(job.payload)
}
```

📌 Neste ponto, o sistema executa jobs corretamente, mas **não retorna resultados**.

---

## 12. Dia 3 — Resultados Tipados por Job

No Dia 3 o sistema evolui para **retornar dados reais** de cada job.

### Result Types

```ts
export type SendEmailResult = {
  messageId: string
  queuedAt: Date
}
```

```ts
export type GenerateReportResult = {
  reportId: string
  format: 'pdf' | 'csv'
  downloadUrl: string
}
```

```ts
export type CleanUpTempFilesResult = {
  scannedFiles: number
  deletedFiles: number
  dryRun: boolean
}
```

---

## 13. Lookup Map — JobResults

```ts
export type JobResults = {
  'send-email': SendEmailResult
  'generate-report': GenerateReportResult
  'clean-up-temp-files': CleanUpTempFilesResult
}
```

📌 Mesmo padrão do `JobPayloads`.

---

## 14. JobHandler<T> — Dia 3

```ts
export type JobHandler<T extends JobType> = (
  payload: JobPayloads[T]
) => Promise<JobResults[T]>
```

Agora:
- o handler **é obrigado a retornar algo**
- o retorno **depende do tipo do job**

---

## 15. Dispatcher — Dia 3

```ts
export async function dispatchJob<T extends JobType>(
  job: Job<T>,
  handlers: JobHandlers
): Promise<JobResults[T]> {
  const handler = handlers[job.type]
  return handler(job.payload)
}
```

📌 Inferência completa de entrada e saída.

---

## 16. Exemplo de Uso

```ts
const result = await dispatchJob(job, handlers)
```

O TypeScript infere automaticamente:
- o tipo correto de `payload`
- o tipo correto de `result`

---

## 17. dryRun

`dryRun` é uma **flag de domínio** que indica:

- `true`: simular execução
- `false`: executar efeitos colaterais reais

📌 Não muda tipos, apenas comportamento.

---

## 18. Estado Atual do Projeto

- Contratos bem definidos
- Entrada e saída tipadas
- Dispatcher genérico
- Sistema observável

---

## 19. Próximo Passo — Dia 4

- jobs que podem falhar
- retorno `success | failure`
- sem `throw`
- sem `try/catch` espalhado

---

## 20. Conceitos e Referências

| Termo | Origem |
|---|---|
| String Literal Union | TypeScript |
| Indexed Access Types | TypeScript |
| Mapped Types | TypeScript |
| Lookup Map | Comunidade |
| Type-driven design | Comunidade |
| dryRun | Domínio |

---

**Este projeto usa TypeScript como ferramenta de design, não apenas anotação de tipos.**


---

## 17. Estrutura de Pastas Atual (Após o Dia 4)

```
src/
├─ index.ts
│
├─ jobs/
│  ├─ dispatcher.ts
│  ├─ types.ts
│  │
│  ├─ payloads/
│  │  ├─ send-email.payload.ts
│  │  ├─ generate-report.payload.ts
│  │  ├─ clean-up-temp-files.payload.ts
│  │  └─ index.ts
│  │
│  ├─ results/
│  │  ├─ send-email.result.ts
│  │  ├─ generate-report.result.ts
│  │  ├─ clean-up-temp-files.result.ts
│  │  └─ index.ts
│  │
│  ├─ errors/
│  │  ├─ send-email.error.ts
│  │  ├─ generate-report.error.ts
│  │  ├─ clean-up-temp-files.error.ts
│  │  └─ index.ts
│  │
│  └─ handlers/
│     ├─ send-email.handler.ts
│     ├─ generate-report.handler.ts
│     ├─ clean-up-temp-files.handler.ts
│     └─ index.ts
```

### Observações de Arquitetura

- `payloads/` → **input tipado** por job
- `results/` → **output tipado** por job
- `errors/` → **falhas tipadas** por job
- `handlers/` → lógica de execução (payload → result)
- `types.ts` → contratos centrais (maps, handlers, dispatcher)

📌 Cada conceito cresce horizontalmente sem criar acoplamento.

---

**Estado do projeto:** pronto para retries, métricas e filas reais (Dia 5).
