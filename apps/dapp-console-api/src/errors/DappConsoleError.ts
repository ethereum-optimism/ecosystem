export type DAPP_CONSOLE_ERROR_CODE =
  | 'DEPLOYMENT_TX_NOT_FOUND'
  | 'DEPLOYMENT_CONTRACT_NOT_FOUND'
  | 'DEPLOYER_ADDRESS_INCORRECT'
  | 'DEPLOYMENT_CONTRACT_ADDRESS_INCORRECT'
  | 'DEPLOYMENT_CONTRACT_ALREADY_EXISTS'
  | 'CONTRACT_DOES_NOT_EXIST'
  | 'CHALLENGE_DOES_NOT_EXIST'
  | 'UNSUPPORTED_CHAIN_ID'
  | 'CHALLENGE_FAILED'
  | 'MAX_APPS_REACHED'
  | 'UNVERIFIED_CONTRACT'
  | 'REBATE_ALREADY_CLAIMED'
  | 'REBATE_PENDING'
  | 'NOT_CB_VERIFIED'
  | 'SANCTIONED_ADDRESS'
  | 'MAX_REBATE_REACHED'
  | 'FAILED_TO_SEND_REBATE'
  | 'INELIGIBLE_CONTRACT'

export const ERROR_MESSAGES: Record<DAPP_CONSOLE_ERROR_CODE, string> = {
  DEPLOYMENT_TX_NOT_FOUND: 'deployment transaction could not be located',
  DEPLOYMENT_CONTRACT_NOT_FOUND:
    'deployment contract not found from supplied deployment tx hash',
  DEPLOYER_ADDRESS_INCORRECT:
    'deployer address does not match address that sent deployment transaction',
  DEPLOYMENT_CONTRACT_ADDRESS_INCORRECT:
    'supplied contract address does not match the contact address created by deployment tx',
  DEPLOYMENT_CONTRACT_ALREADY_EXISTS: `supplied deployment contract already exists in user's account`,
  CONTRACT_DOES_NOT_EXIST: `contract is not active on user's account`,
  CHALLENGE_DOES_NOT_EXIST: `challenge does not exist or is expired`,
  UNSUPPORTED_CHAIN_ID: 'chain id is not supported by the dev console',
  CHALLENGE_FAILED: 'challenge was not completed successfully',
  MAX_APPS_REACHED: 'account has reached the maximum number of applications',
  UNVERIFIED_CONTRACT: 'contract must be verified',
  REBATE_ALREADY_CLAIMED:
    'a rebate has already been claimed for this transaction',
  REBATE_PENDING: 'rebate is pending',
  NOT_CB_VERIFIED: 'entity does not have a cb verified wallet linked',
  SANCTIONED_ADDRESS: 'sanctioned address',
  MAX_REBATE_REACHED: 'entity has already claimed the max amount of rebates',
  FAILED_TO_SEND_REBATE: 'wallet failed to send rebate to user',
  INELIGIBLE_CONTRACT: 'contract not eligible for deployment rebate',
}

export class DappConsoleError extends Error {
  public readonly code

  constructor(opts: { code: DAPP_CONSOLE_ERROR_CODE }) {
    const message = ERROR_MESSAGES[opts.code]
    const cause = new Error(message)

    super(message, { cause })

    this.code = opts.code
  }
}
