import { Counter } from 'prom-client'

export type MetricsNamespaceLabel = (typeof metricsNamespaceLabels)[number]
export type DefaultMetricsNamespaceLabels = Partial<
  Record<MetricsNamespaceLabel, string | number>
>
export type Metrics = typeof metrics

export const metricsNamespaceLabels = ['apiVersion', 'chainId'] as const

// PromClient is registered globally, so no need to inject it
export const metrics = {
  screeningServiceCallFailures: new Counter({
    name: 'screeningServiceCallFailures',
    help: 'Number of failures when calling the screening service',
    labelNames: [...metricsNamespaceLabels] as const,
  }),
  sanctionedAddressBlocked: new Counter({
    name: 'sanctionedAddressBlocked',
    help: 'Number of addresses screened',
    labelNames: [...metricsNamespaceLabels] as const,
  }),
  policyIdVerificationFailures: new Counter({
    name: 'policyIdVerificationFailures',
    help: 'Number of policy ID verification failures',
    labelNames: [...metricsNamespaceLabels] as const,
  }),
  providerMetadataNotFoundForPolicyId: new Counter({
    name: 'providerMetadataNotFound',
    help: 'Number of times provider metadata was not found for a policy ID',
    labelNames: [...metricsNamespaceLabels] as const,
  }),
  paymasterCallRpcFailures: new Counter({
    name: 'paymasterCallRpcFailures',
    help: 'Number of RPC failures when calling the paymaster RPC',
    labelNames: [...metricsNamespaceLabels, 'jsonRpcCode'] as const,
  }),
  paymasterCallNonRpcFailures: new Counter({
    name: 'paymasterCallNonRpcFailures',
    help: 'Number of non-RPC failures when calling the paymaster RPC',
    labelNames: [...metricsNamespaceLabels] as const,
  }),
  paymasterCallSuccesses: new Counter({
    name: 'paymasterCallSuccesses',
    help: 'Number of successes when calling the paymaster RPC',
    labelNames: [...metricsNamespaceLabels] as const,
  }),
  unhandledApiServerErrorCount: new Counter({
    name: 'unhandledApiServerErrorCount',
    help: 'Number of unhandled API server errors',
    labelNames: ['apiVersion'] as const,
  }),
  unhandledAdminApiServerErrorCount: new Counter({
    name: 'unhandledAdminApiServerErrorCount',
    help: 'Number of unhandled Admin API server errors',
  }),
} as const
