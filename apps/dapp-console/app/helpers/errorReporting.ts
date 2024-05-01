import { captureException, setUser } from '@sentry/nextjs'

export type WalletActionContext = 'linkWallet' | 'unlinkWallet' | 'signMessage'
export type AppActionContext = 'createApp' | 'editAppName' | 'deleteApp'
export type ContractActionContext =
  | 'createContract'
  | 'deleteContract'
  | 'startContractVerification'
  | 'completeContractVerification'

export type ErrorActionContext =
  | WalletActionContext
  | AppActionContext
  | ContractActionContext

export const captureError = (exception: unknown, action: ErrorActionContext) =>
  captureException(exception, { data: { action } })

export const setErrorReportingUser = (id?: string) =>
  setUser(id ? { id } : null)
