import { initVerbs, type VerbsConfig, type VerbsSDK } from '@eth-optimism/verbs'

import { env } from './env.js'

let verbsInstance: VerbsSDK

export function createVerbsConfig(): VerbsConfig {
  return {
    wallet: {
      type: 'privy',
      appId: env.PRIVY_APP_ID,
      appSecret: env.PRIVY_APP_SECRET,
    },
  }
}

export function initializeVerbs(config?: VerbsConfig): void {
  const verbsConfig = config || createVerbsConfig()
  verbsInstance = initVerbs(verbsConfig)
}

export function getVerbs(): VerbsSDK {
  if (!verbsInstance) {
    throw new Error('Verbs SDK not initialized. Call initializeVerbs() first.')
  }
  return verbsInstance
}
