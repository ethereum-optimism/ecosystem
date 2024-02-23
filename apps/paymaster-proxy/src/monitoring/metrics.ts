import { CurriableCounter } from '@/monitoring/CurriableCounter'
import type { Curriable } from '@/monitoring/types'

const metricsNamespaces = ['apiVersion', 'chainId'] as const
type MetricsNamespace = (typeof metricsNamespaces)[number]

// PromClient is registered globally, so no need to inject it
export const metrics = {
  screeningServiceCallFailures: CurriableCounter.create({
    name: 'screeningServiceCallFailures',
    help: 'Number of failures when calling the screening service',
    labelNames: [...metricsNamespaces] as const,
  }),
  sanctionedAddressBlocked: CurriableCounter.create({
    name: 'sanctionedAddressBlocked',
    help: 'Number of addresses screened',
    labelNames: [...metricsNamespaces] as const,
  }),
} as const satisfies Record<string, Curriable<string, string>>

const getMetricsForApiVersion = (apiVersion: string) => {
  // map throug metrics and return one that has each metric curried with apiVersion
  // with typesafety
  return Object.fromEntries(
    Object.entries(metrics).map(([key, metric]) => [
      key,
      metric.curryWith({ apiVersion }),
    ]),
  ) as {
    [K in keyof typeof metrics]: ReturnType<(typeof metrics)[K]['curryWith']>
  }
}

const apiV0Metrics = getMetricsForApiVersion('v0')

export type Metrics = typeof metrics
