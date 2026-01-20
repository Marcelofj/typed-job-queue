import { InMemoryJobQueue } from './jobs/infrastructure/queues/in-memory.queue'
import { JobWorker } from './jobs/application/workers/job.worker'
import { handlers } from './jobs/application/registries/job-handler.registry'
import { ConsoleTelemetryAdapter } from './jobs/infrastructure/observability/console-telemetry-adapter.observability'

const queue = new InMemoryJobQueue()
const telemetry = new ConsoleTelemetryAdapter()
const worker = new JobWorker(queue, handlers, telemetry)

console.log(worker)