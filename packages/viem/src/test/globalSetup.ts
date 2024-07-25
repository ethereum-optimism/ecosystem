import { startProxy } from '@viem/anvil'
import { optimism } from 'viem/chains'

import {
  setupCrossL2Inbox,
  setupL1BlockInterop,
  setupL2ToL2CrossDomainMessenger,
} from './setupInterop'

async function main() {
  const shutdown = await startProxy({
    host: '::',
    options: {
      chainId: optimism.id,
    },
  })

  await setupL1BlockInterop()
  await setupCrossL2Inbox()
  await setupL2ToL2CrossDomainMessenger()

  return () => {
    shutdown()
  }
}

export default main
