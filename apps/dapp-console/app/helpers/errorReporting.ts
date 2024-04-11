import { captureException } from '@sentry/nextjs'

export type ErrorActionContext = 'linkWallet' | 'unlinkWallet'

export const captureError = (exception: unknown, action: ErrorActionContext) =>
  captureException(exception, { data: { action } })
