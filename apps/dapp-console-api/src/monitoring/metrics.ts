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
  deleteAppErrorCount: new Counter({
    name: 'delete_app_error_count',
    help: 'Total number of errors encountered while deleting an app',
  }),
  deleteContractsInAppErrorCount: new Counter({
    name: 'delete_contracts_in_app_error_count',
    help: 'Total number of errors encountered while deleting all contracts in an app',
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
  fetchCbVerificationFromEasErrorCount: new Counter({
    name: 'fetch_cb_verification_from_eas_error_count',
    help: 'Total number of errors encountered when using eas to fetch cb verification status',
  }),
  updateWalletVerificationsErrorCount: new Counter({
    name: 'update_wallet_verifications_error_count',
    help: 'Total number of errors encountered when updating wallet verifications',
  }),
  fetchWalletVerificationsErrorCount: new Counter({
    name: 'fetch_wallet_verifications_error_count',
    help: 'Total number of errors encountered while fetching wallet verifications',
  }),
  fetchDeploymentRebateErrorCount: new Counter({
    name: 'fetch_deployment_rebate_error_count',
    help: 'Total number of errors encountered while fetching a deployment rebate',
  }),
  sendRebateTxErrorCount: new Counter({
    name: 'send_rebate_tx_error_count',
    help: 'Total number of times the transaction for sending a deployment rebate failed',
  }),
  fetchRebateTxReceiptErrorCount: new Counter({
    name: 'fetch_rebate_tx_receipt_error_count',
    help: 'Total number of times the transaction receipt for the rebate transaction failed to be fetched',
  }),
  fetchPendingRebateErrorCount: new Counter({
    name: 'fetch_pending_rebate_error_count',
    help: 'Total number of times the server failed to fetch a pending rebate',
  }),
  insertPendingDeploymentRebateErrorCount: new Counter({
    name: 'insert_pending_deployment_rebate_error_count',
    help: 'Total number of times the server failed to insert a pending deployment rebate',
  }),
  updateCompletedDeploymentRebateErrorCount: new Counter({
    name: 'update_completed_deployment_rebate_error_count',
    help: 'Total number of times the server failed to update a pending rebate to completed',
  }),
  updateDeploymentRebateToPendingErrorCount: new Counter({
    name: 'update_deployment_rebate_to_pending_error_count',
    help: 'Total number of times the server failed to update a rebate to pending',
  }),
  fetchCompletedRebatesListErrorCount: new Counter({
    name: 'fetch_completed_rebates_list_error_count',
    help: 'Total number of times the server failed to fetch the list of completed deployment rebates',
  }),
  traceTxErrorCount: new Counter({
    name: 'trace_tx_error_count',
    help: 'Total number of times the server failed to trace a transaction',
  }),
  deleteContractErrorCount: new Counter({
    name: 'delete_contract_error_count',
    help: 'Total number of times the server failed to delete a contract',
  }),
  restoreDeletedContractErrorCount: new Counter({
    name: 'restore_deleted_contract_error_count',
    help: 'Total number of times a deleted contract failed to be restored',
  }),
  screeningServiceCallErrorCount: new Counter({
    name: 'screening_service_call_error_count',
    help: 'Number of failures when calling the screening service',
  }),
  sanctionedAddressBlocked: new Counter({
    name: 'sanctioned_address_blocked',
    help: 'Number of addresses screened',
    labelNames: ['entityId'] as const,
  }),
  fetchEntityErrorCount: new Counter({
    name: 'fetch_entity_error_count',
    help: 'Number of failures when fetching entity from db',
  }),
  sanctionEntityErrorCount: new Counter({
    name: 'sanction_entity_error_count',
    help: 'Number of times entity failed to be marked as sanctioned',
  }),
  getWalletsByEntityIdErrorCount: new Counter({
    name: 'get_wallets_by_entity_id_error_count',
    help: 'Number of times server failed to get wallets for an entity id',
  }),
  privyVerifyAuthTokenErrorCount: new Counter({
    name: 'privy_verify_auth_token_error_count',
    help: 'Number of times privy access token verification failed',
  }),
  insertEntityErrorCount: new Counter({
    name: 'insert_entity_error_count',
    help: 'Number of times a new entity failed to be inserted into db',
  }),
  failedToSaveUserIronSessionErrorCount: new Counter({
    name: 'failed_to_save_user_iron_session_error_count',
    help: 'Number of times the iron session failed to be saved with a new user',
  }),
}
