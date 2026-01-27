import { cleanUpTempFilesHandler, generateReportHandler, sendEmailHandler, type JobHandlers } from './jobs/domain/index.js'
import { JobWorker, JobFactory, JobExecutionMetricsContext } from './jobs/application/index.js'
import {
  ConsoleTelemetryAdapter,
  InMemoryJobRepository,
  InMemoryJobQueue
} from './jobs/infrastructure/index.js'


// --------------------
// Domínio
// --------------------

const handlers: JobHandlers = {
  'send-email': sendEmailHandler,
  'generate-report': generateReportHandler,
  'clean-up-temp-files': cleanUpTempFilesHandler
}

// --------------------
// Infraestrutura
// --------------------

const telemetry = new ConsoleTelemetryAdapter()
const repository = new InMemoryJobRepository()
const queue = new InMemoryJobQueue()

// --------------------
// Application
// --------------------

const observer = new JobExecutionMetricsContext(telemetry)
const jobWorker = new JobWorker(repository, queue, handlers, observer)
const jobFactory = new JobFactory(repository, queue)

// --------------------
// Seed inicial
// --------------------

async function seed() {
  await jobFactory.create('send-email', {
    to: 'user@test.com',
    subject: 'Hello',
    body: 'Welcome!'
  })

  await jobFactory.create('generate-report', {
    userId: 'user-123',
    format: 'pdf'
  })

  await jobFactory.create('clean-up-temp-files', {
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

  await jobWorker.runOnce()
  await jobWorker.runOnce()
  await jobWorker.runOnce()
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
