# Typed Job Queue – Architecture & Design Notes

Este documento registra o **estado arquitetural oficial** do projeto *Typed Job Queue* até o **Dia 7** do estudo.

Objetivo: permitir continuidade consistente do desenvolvimento, preservar decisões de design e servir como referência permanente (humana e para futuras sessões de IA).

---

## 1. Visão Geral do Projeto

Construir um sistema de execução de jobs em backend usando:

- Node.js + TypeScript
- ESM real (NodeNext)
- Type-driven design
- Contratos estáticos fortes
- Zero `any`, zero casts, zero validação manual em runtime
- Sem `throw` como fluxo de domínio

O sistema modela:

- Jobs como intenções de domínio
- Payloads, resultados e erros tipados por job
- Execução com retry e classificação de falhas
- Observabilidade desde a fundação
- Persistência abstrata via repositório

---

## 2. Princípios de Arquitetura

### 2.1 Type-driven design

- Tipos são contratos de execução
- Inferência completa sempre que possível
- Discriminated unions para estados e resultados

### 2.2 Camadas

Separação estrita:

- `domain/` → contratos, tipos, entidades, sem dependência técnica
- `application/` → orquestração, políticas, workers, observabilidade
- `infrastructure/` → filas, repositórios, adapters concretos

O domínio não conhece infraestrutura.
A aplicação depende do domínio.
A infraestrutura depende do domínio + application.

---

## 3. Estrutura Atual do Projeto (até Dia 7)

```
src
├── jobs
│   ├── application
│   │   ├── dispatchers
│   │   │   ├── dispatch-job.dispatchers.ts
│   │   │   └── execution-context.dispatchers.ts
│   │   ├── factories
│   │   │   └── create-job.factory.ts
│   │   ├── observability
│   │   │   ├── execution-metrics-context.observability.ts
│   │   │   ├── execution-observer.observability.ts
│   │   │   ├── job-telemetry-events.observability.ts
│   │   │   └── job-telemetry-port.observability.ts
│   │   ├── policies
│   │   │   ├── failure-classification.policy.ts
│   │   │   └── retry.policy.ts
│   │   ├── registries
│   │   │   └── job-handler.registry.ts
│   │   └── workers
│   │       └── job.worker.ts
│   │
│   ├── domain
│   │   ├── core   (nome sugerido para agrupar os jobs de domínio)
│   │   │   ├── clean-up-temp-files
│   │   │   ├── generate-report
│   │   │   └── send-email
│   │   │
│   │   ├── types
│   │   │   ├── job.type.ts
│   │   │   ├── job-status.type.ts
│   │   │   ├── job-failure-kind.type.ts
│   │   │   ├── job-payloads.type.ts
│   │   │   ├── job-results.type.ts
│   │   │   ├── job-errors.type.ts
│   │   │   ├── job-handler.type.ts
│   │   │   └── job-execution.type.ts
│   │   │
│   │   ├── entities
│   │   │   └── job.entity.ts
│   │   │
│   │   ├── repositories
│   │   │   └── job-repository.port.ts
│   │   │
│   │   └── index.ts
│   │
│   └── infrastructure
│       ├── observability
│       │   ├── console-telemetry-adapter.observability.ts
│       │   └── index.ts
│       └── queues
│           ├── in-memory.queue.ts
│           ├── index.ts
│           └── job.queue.ts
│
└── main.ts
```

---

## 4. Tipos Centrais do Domínio

### 4.1 JobType

```ts
export type JobType =
  | 'send-email'
  | 'generate-report'
  | 'clean-up-temp-files'
```

---

### 4.2 Payloads / Results / Errors (Lookup Maps)

Todos organizados em arquivos dedicados:

- `job-payloads.type.ts`
- `job-results.type.ts`
- `job-errors.type.ts`

Padrão:

```ts
export type JobPayloads = { ... }
export type JobResults = { ... }
export type JobErrors = { ... }
```

Uso via Indexed Access Types:

```ts
JobPayloads[T]
```

---

### 4.3 Status de Job

```ts
export type JobStatus =
  | 'pending'
  | 'running'
  | 'success'
  | 'failure'
```

---

### 4.4 Failure Kind

```ts
export type JobFailureKind =
  | 'fatal'
  | 'retryable'
```

Centralizado em:

```
domain/types/job-failure-kind.type.ts
```

---

### 4.5 Resultado de Execução (Discriminated Union)

```ts
export type JobExecutionSuccess<T> = {
  status: 'success'
  data: T
}

export type JobExecutionFailure<E> = {
  status: 'failure'
  kind: JobFailureKind
  error: E
}

export type JobExecutionResult<T, E> =
  | JobExecutionSuccess<T>
  | JobExecutionFailure<E>
```

---

## 5. Entidade de Domínio – JobEntity

Arquivo:

```
src/jobs/domain/entities/job.entity.ts
```

```ts
export type JobEntity<T extends JobType = JobType> = {
  id: string
  type: T
  payload: JobPayloads[T]

  status: JobStatus
  attempts: number

  createdAt: Date
  updatedAt: Date
}
```

📌 Esta é uma entidade de domínio lógica — **não é modelo de banco**.
Persistência concreta fica na infraestrutura.

---

## 6. Repositório de Jobs (Port)

Arquivo:

```
src/jobs/domain/repositories/job-repository.port.ts
```

Contrato típico:

- `save(job)`
- `update(job)`
- `findNextPending()`

---

## 7. Fábrica de Jobs (Dia 7)

Arquivo:

```
src/jobs/application/factories/create-job.factory.ts
```

Responsabilidades:

- Criar JobEntity
- Inicializar status / timestamps
- Persistir via repositório

---

## 8. Worker com Persistência

Arquivo:

```
src/jobs/application/workers/job.worker.ts
```

Fluxo:

1. Busca próximo job pendente no repositório
2. Marca como `running`
3. Executa via `executeWithPolicy`
4. Atualiza status para `success` ou `failure`
5. Persiste novamente

Sem exceções como fluxo de controle.

---

## 9. Observabilidade (Dia 6)

Camada:

```
src/jobs/application/observability
```

Componentes:

- `job-telemetry-events.observability.ts` → contratos de eventos
- `job-telemetry-port.observability.ts` → porta de publicação
- `execution-metrics-context.observability.ts` → wrapper de execução
- `execution-observer.observability.ts` → integração com execução

Infra concreta:

```
infrastructure/observability/console-telemetry-adapter.observability.ts
```

---

## 10. Execução com Retry e Policies

Camada:

```
application/policies
```

- `retry.policy.ts`
- `failure-classification.policy.ts`

Usadas pelo:

```
execution-context.dispatchers.ts
```

---

## 11. Configuração de Build e Runtime

### 11.1 ESM Real (NodeNext)

Configuração principal:

- `module: NodeNext`
- `moduleResolution: NodeNext`
- `"type": "module"` no package.json

Imports em TS devem usar extensão `.js`:

```ts
import { JobWorker } from './jobs/.../job.worker.js'
```

---

### 11.2 tsconfig.json (dev)

- `noEmit: true`
- sem `outDir`
- usado com `tsx watch`

---

### 11.3 tsconfig.build.json (produção)

- herda do tsconfig.json
- sobrescreve:

```json
{
  "noEmit": false,
  "rootDir": "src",
  "outDir": "dist"
}
```

---

### 11.4 Scripts

```json
"scripts": {
  "dev": "tsx watch src/main.ts",
  "start": "tsx src/main.ts",
  "build": "tsc -p tsconfig.build.json",
  "prod": "node dist/main.js",
  "typecheck": "tsc --noEmit --watch"
}
```

Em produção:

```
npm run build
npm run prod
```

---

## 12. Decisões Importantes Registradas

- Node ESM real (não Bundler)
- Imports com `.js` em código TS
- Dois tsconfigs (dev e build)
- `noEmit` em dev para evitar dist lixo
- Domínio não conhece infraestrutura
- Entidades ≠ modelos de banco

---

## 13. Estado Atual do Roadmap

Concluído:

- Dia 1 – Contratos básicos
- Dia 2 – Handlers e dispatcher
- Dia 3 – Resultados tipados
- Dia 4 – Falhas tipadas
- Dia 5 – Retry + policies
- Dia 6 – Observabilidade
- Dia 7 – Persistência + JobEntity + Repository + Worker com estado

Próximos passos previstos:

- Dia 8 – Filas reais (Redis, BullMQ, etc)
- Dia 9 – Scheduler / múltiplos workers
- Dia 10 – Idempotência / locking
- Dia 11 – Dead letter queue
- Dia 12 – API HTTP para submissão de jobs

---

## 14. Nota Final

Este projeto usa TypeScript como ferramenta de **design arquitetural**, não apenas tipagem.

Este arquivo é o **ponto de restauração oficial de contexto** do projeto.

Sempre que iniciar uma nova sessão, cole este documento para continuidade perfeita.

