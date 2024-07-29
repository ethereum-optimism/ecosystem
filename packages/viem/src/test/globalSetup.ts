import { startProxy } from '@viem/anvil'
import { optimism } from 'viem/chains'

import { configureDependencySet } from '@/test/setupInterop.js'
import { setupTicTacToe } from '@/test/setupTicTacToe.js'

async function main() {
  const shutdown = await startProxy({
    host: '::',
    options: {
      init: './assets/l2-genesis.json',
      chainId: optimism.id,
    },
  })

  await configureDependencySet()
  await setupTicTacToe()

  return () => {
    shutdown()
  }
}

export default main
