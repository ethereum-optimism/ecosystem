import type { Express } from 'express'

import { envVars } from '@/envVars'
import { initializeApiServer } from '@/initializeApiServer'

const HOST = '0.0.0.0'

export class ProxyService {
  private readonly apiServer: Express

  constructor(apiServer: Express) {
    this.apiServer = apiServer
  }

  static async init() {
    const apiServer = await initializeApiServer()

    return new ProxyService(apiServer)
  }

  async run() {
    this.apiServer.listen(envVars.PORT, HOST, () => {
      console.log(`API server listening at http://${HOST}:${envVars.PORT}`)
    })
  }
}
