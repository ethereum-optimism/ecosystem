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
  logoutUserErrorCount: new Counter({
    name: 'logout_user_error_count',
    help: 'Total number of errors encountered while logging user out',
  }),
  privySyncWalletsErrorCount: new Counter({
    name: 'privy_sync_wallets_error_count',
    help: 'Total number of errors encountered while attempting to sync linked privy wallets',
  }),
  listWalletsErrorCount: new Counter({
    name: 'list_wallets_error_count',
    help: 'Total number of errors encountered while attempting to fetch wallets from db',
  }),
  listAppsErrorCount: new Counter({
    name: 'list_apps_error_count',
    help: 'Total number of errors encountered while attempting to fetch apps from db',
  }),
}
