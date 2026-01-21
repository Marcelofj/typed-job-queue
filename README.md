
# Sistema de Jobs Tipado em TypeScript 

Esta documentação descreve os **conceitos**, **padrões** e **exemplos reais** usados no projeto de estudo de **TypeScript + Node.js**, cobrindo **do Dia 1 ao Dia 6**.

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

Um **lookup map** associa cada `JobType` ao tipo correto de payload.

```ts
export type JobPayloads = {
  'send-email': SendEmailPayload
  'generate-report': GenerateReportPayload
  'clean-up-temp-files': CleanUpTempFilesPayload
}
```

---

## 5. Job<T>

```ts
export type Job<T extends JobType> = {
  id: string
  type: T
  payload: JobPayloads[T]
}
```

---

## 6. createJob

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

---

## 7. Dia 4 — ExecutionResult e Falhas Tipadas

Introdução de:

- `ExecutionSuccess`
- `ExecutionFailure`
- `ExecutionResult<T, E>`

Sistema passa a representar falhas como **valores tipados**, não exceções.

---

## 8. Dia 5 — Retry, Worker e Filas

- `RetryPolicy`
- `executeWithPolicy`
- `JobWorker`
- `JobQueue` (abstração)

Execução passa a ter:
- múltiplas tentativas
- classificação de falhas
- separação entre domínio e infraestrutura

---

## 9. Dia 6 — Observabilidade Tipada

Introdução de contratos de telemetria:

- `JobTelemetryEvent`
- `JobTelemetryPort`
- `ExecutionMetricsContext`

Sistema passa a emitir eventos de:

- job-started
- job-succeeded
- job-failed

Sem acoplamento a ferramentas reais (logs, métricas, tracing).

---

## 10. Estrutura Atual do Projeto (Dia 6)

```
src
└── jobs
    ├── application
    │   ├── dispatchers
    │   ├── factories
    │   ├── policies
    │   ├── registries
    │   ├── workers
    │   └── observability   ← contratos de telemetria
    │
    ├── domain
    │   ├── send-email
    │   ├── generate-report
    │   ├── clean-up-temp-files
    │   └── types
    │
    └── infrastructure
        └── queues
```

---

## 11. Estado Atual

- Sistema totalmente tipado
- Sem exceções de controle de fluxo
- Contratos estáveis
- Pronto para integrar filas reais, persistência e tracing distribuído

---

**Este projeto usa TypeScript como ferramenta de design arquitetural.**
