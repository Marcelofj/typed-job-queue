import { InMemoryJobRepository } from './jobs/infrastructure/index.js'

import { handlers, JobWorker, JobFactory } from './jobs/application/index.js'

// --------------------
// Infraestrutura
// --------------------

const repository = new InMemoryJobRepository()

// --------------------
// Application
// --------------------

const worker = new JobWorker(repository, handlers)
const jobFactory = new JobFactory(repository)

// --------------------
// Seed inicial
// --------------------

async function seed() {
  jobFactory.create('send-email', {
    to: 'user@test.com',
    subject: 'Hello',
    body: 'Welcome!'
  })

  jobFactory.create('generate-report', {
    userId: 'user-123',
    format: 'pdf'
  })

  jobFactory.create('clean-up-temp-files', {
    directory: '/tmp',
    maxAgeInDays: 7,
    dryRun: true
  })
}

// --------------------
// Execução manual
// --------------------

async function main() {
  await seed()

  await worker.runOnce()
  await worker.runOnce()
  await worker.runOnce()
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
