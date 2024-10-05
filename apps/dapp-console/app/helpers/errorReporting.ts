import { captureException, setUser } from '@sentry/nextjs'

export type AuthActionContext = 'loginUser' | 'logoutUser'
export type PrivyActionContext = 'privyLogin'
export type FeatureFlagInvalid = 'invalidFeatureFlag'

export type ErrorActionContext =
  | AuthActionContext
  | PrivyActionContext
  | FeatureFlagInvalid

export const captureError = (exception: unknown, action: ErrorActionContext) =>
  captureException(exception, { data: { action } })

export const setErrorReportingUser = (id?: string) =>
  setUser(id ? { id } : null)
