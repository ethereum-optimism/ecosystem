import type { Logger } from 'pino'
import type pino from 'pino'

export const mockLogger: Logger = {
  error: ((msg?: string, ...args: any[]) => {
    console.error(msg) // eslint-disable-line no-console
  }) as pino.LogFn,
} as any
