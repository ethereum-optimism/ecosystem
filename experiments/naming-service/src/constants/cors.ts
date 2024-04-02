import { envVars } from './envVars'

/**
 * Allowlist of regexes of websites that will accept cors headers
 * When we open source we can make this an env variable
 */
export const corsAllowlist = [
  ...(envVars.DEPLOYMENT_ENV !== 'production'
    ? envVars.DEV_CORS_ALLOWLIST_REG_EXP
    : []),
  ...envVars.CORS_ALLOWLIST_REG_EXP,
]
