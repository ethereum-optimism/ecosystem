import type { Logger } from 'pino'

import type {
  DefaultMetricsNamespaceLabels,
  Metrics,
} from '@/monitoring/metrics'

export type MonitoringCtx = {
  logger: Logger
  metrics: Metrics
  defaultMetricLabels: DefaultMetricsNamespaceLabels
}
