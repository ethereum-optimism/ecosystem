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
  listContractsErrorCount: new Counter({
    name: 'list_contracts_error_count',
    help: 'Total number of errors encountered while attempting to fetch contracts from db',
  }),
  fetchContractErrorCount: new Counter({
    name: 'fetch_contract_error_count',
    help: 'Total number of errors encountered while attempting to fetch a single contract from db',
  }),
  fetchActiveAppsCountErrorCount: new Counter({
    name: 'fetch_active_apps_count_error_count',
    help: 'Total number of errors encountered while fetching count of active apps',
  }),
  createAppErrorCount: new Counter({
    name: 'create_app_error_count',
    help: 'Total number of errors encountered while creating an app',
  }),
  editAppErrorCount: new Counter({
    name: 'edit_app_error_count',
    help: 'Total number of errors encountered while editing an app',
  }),
  fetchingTxErrorCount: new Counter({
    name: 'fetching_tx_error_count',
    help: 'Total number of errors encountered while fetching tx',
    labelNames: ['chainId'] as const,
  }),
  insertContractErrorCount: new Counter({
    name: 'insert_contract_error_count',
    help: 'Total number of errors encountered while inserting a new contract',
  }),
  fetchChallengeErrorCount: new Counter({
    name: 'fetch_challenge_error_count',
    help: 'Total number of errors encountered while attempting to fetch a single challenge from db',
  }),
  insertChallengeErrorCount: new Counter({
    name: 'insert_challenge_error_count',
    help: 'Total number of errors encountered while inserting a new challenge',
  }),
  completeChallengeErrorCount: new Counter({
    name: 'complete_challenge_error_count',
    help: 'Total number of times the server failed to mark a challenge as complete',
  }),
  fetchTotalRebatesClaimedErrorCount: new Counter({
    name: 'fetch_total_rebates_claimed_error_count',
    help: 'Total number of errors encountered while fetching total rebates claimed',
  }),
}
