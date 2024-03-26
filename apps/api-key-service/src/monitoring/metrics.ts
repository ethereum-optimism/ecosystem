import { Counter } from 'prom-client'

export type Metrics = typeof metrics

export const metrics = {
  unhandledApiServerErrorCount: new Counter({
    name: 'unhandled_api_server_error_count',
    help: 'Number of unhandled API server errors',
    labelNames: ['apiVersion'] as const,
  }),
}
