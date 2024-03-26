import { Counter } from 'prom-client'

export type Metrics = typeof metrics

export const metrics = {
  unhandledApiServerErrorCount: new Counter({
    name: 'unhandled_api_server_error_count',
    help: 'Number of unhandled API server errors',
    labelNames: ['apiVersion'] as const,
  }),
  trpcServerErrorCount: new Counter({
    name: 'trpc_server_total_error_count',
    help: 'Total number of errors encounterted in trpc server',
    labelNames: ['apiVersion'] as const,
  }),
}
