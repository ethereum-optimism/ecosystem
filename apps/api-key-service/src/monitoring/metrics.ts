import { Counter } from 'prom-client'

export type Metrics = typeof metrics

export const metrics = {
  unhandledApiServerErrorCount: new Counter({
    name: 'unhandled_api_server_error_count',
    help: 'Number of unhandled API server errors',
    labelNames: ['apiVersion'] as const,
  }),
  generatedApiKeysCount: new Counter({
    name: 'generated_api_keys_count',
    help: 'Number of generated API keys',
  }),
  apiKeyGenerationFailureCount: new Counter({
    name: 'api_key_generation_failure_count',
    help: 'Number of times API key generation failed',
  }),
  dbCallFailureCount: new Counter({
    name: 'db_call_failure_count',
    help: 'Number of times calling DB failed',
  }),
}
