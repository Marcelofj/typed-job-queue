// import { dispatchJob } from './jobs/application/dispatchers/dispatch-job.dispatcher'
import { createJob } from './jobs/application/factories/create-job.factory'
import { handlers } from './jobs/application/registries/job-handler.registry'
// import { executeWithPolicy } from './jobs/application/dispatchers/execution-context.dispatcher'
import { InMemoryJobQueue } from './jobs/infrastructure/queues/in-memory.queue'
import { JobWorker } from './jobs/application/workers/job.worker'

const queue = new InMemoryJobQueue()
const worker = new JobWorker(queue, handlers)

const job1 = createJob('send-email', {
  to: 'marcelofj@gmail.com',
  subject: 'Estudo de type-driven design',
  body: 'É isso'
})


const job2 = createJob('generate-report', {
  userId: crypto.randomUUID(),
  format: 'csv'
})

const job3 = createJob('clean-up-temp-files', {
  directory: '/tmp',
  maxAgeInDays: 30,
  dryRun: false
})

// const result1 = await dispatchJob(job1, handlers)
// const result2 = await dispatchJob(job2, handlers)
// const result3 = await dispatchJob(job3, handlers)

// const result = {
//   'send-email': result1,
//   'generate-report': result2,
//   'clean-up-temp-files': result3
// }

// console.log(result)

await queue.enqueue(job1)
await queue.enqueue(job2)
await queue.enqueue(job3)

await worker.runOnce()
await worker.runOnce()
await worker.runOnce()