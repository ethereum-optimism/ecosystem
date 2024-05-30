import type { Worker as WorkerInner } from 'bullmq'

export class Worker {
  // escape hatch to access the BullMq Worker
  public bullMqWorker: WorkerInner

  constructor(bullMqWorker: WorkerInner) {
    this.bullMqWorker = bullMqWorker
  }

  async start() {
    await this.bullMqWorker.run()
  }

  async pause() {
    await this.bullMqWorker.pause()
  }

  async resume() {
    await this.bullMqWorker.resume()
  }

  async stop() {
    await this.bullMqWorker.close()
  }
}
