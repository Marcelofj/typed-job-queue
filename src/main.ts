import { InMemoryJobQueue, ConsoleTelemetryAdapter } from './jobs/infrastructure'
import { JobWorker, handlers } from './jobs/application'

const queue = new InMemoryJobQueue()
const telemetry = new ConsoleTelemetryAdapter()
const worker = new JobWorker(queue, handlers, telemetry)

console.log(worker)