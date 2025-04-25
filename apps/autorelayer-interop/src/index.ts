import { pino } from 'pino'

import { parseConfig } from '@/config/config.js'
import { relayPendingMessages } from '@/relayer.js'

export const log = pino({
  level: process.env.LOG_LEVEL || 'debug',
  transport: {
    // TODO: adjust target pased on dev/prod
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: true,
      ignore: 'pid,hostname',
    },
  },
})

const config = await parseConfig(log)

// run the worker
log.info('starting worker on interval (%dms)...', config.loopIntervalMs)
const interval = setInterval(async () => {
  try {
    await relayPendingMessages(log, config)
  } catch (error) {
    log.error({ error }, 'failed run')
  }
}, config.loopIntervalMs)

// cleanup
function shutdown() {
  log.info('shutting down...')
  clearInterval(interval)
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
