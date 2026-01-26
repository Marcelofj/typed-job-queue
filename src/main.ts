// src/main.ts

import {
  ConsoleTelemetryAdapter,
  InMemoryJobRepository,
  InMemoryJobQueue
} from './jobs/infrastructure/index.js'

import { handlers, JobWorker, JobFactory } from './jobs/application/index.js'

// --------------------
// Infraestrutura
// --------------------

const repository = new InMemoryJobRepository()
const queue = new InMemoryJobQueue()

// --------------------
// Application
// --------------------

const jobWorker = new JobWorker(repository, queue, handlers)
const jobFactory = new JobFactory(repository, queue)

// --------------------
// Seed inicial
// --------------------

async function seed() {
  const job1 = await jobFactory.create('send-email', {
    to: 'user@test.com',
    subject: 'Hello',
    body: 'Welcome!'
  })

  const job2 = await jobFactory.create('generate-report', {
    userId: 'user-123',
    format: 'pdf'
  })

  const job3 = await jobFactory.create('clean-up-temp-files', {
    directory: '/tmp',
    maxAgeInDays: 7,
    dryRun: true
  })

  // 🔹 fila recebe APENAS IDs
  await queue.enqueue(job1.id)
  await queue.enqueue(job2.id)
  await queue.enqueue(job3.id)
}

// --------------------
// Execução manual
// --------------------

async function main() {
  await seed()

  await jobWorker.runOnce()
  await jobWorker.runOnce()
  await jobWorker.runOnce()
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
