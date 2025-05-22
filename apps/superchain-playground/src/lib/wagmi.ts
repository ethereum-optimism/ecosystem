import '@rainbow-me/rainbowkit/styles.css'

import { networks } from '@eth-optimism/viem/chains'
import { type Chain, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { createConfig } from 'wagmi'
import { metaMask, walletConnect } from 'wagmi/connectors'

import { devAccount } from '@/connectors/devAccount'
import { envVars } from '@/envVars'
import { useConfig } from '@/stores/useConfig'

export const defaultDevAccount = privateKeyToAccount(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
)

const ns = Object.values(networks)

const sourceChains = ns.map((n) => n.sourceChain)
const chains = ns.flatMap((n) => n.chains)
const allChains = [...sourceChains, ...chains] as const

export const useWagmiconfig = () => {
  const config = useConfig()

  return createConfig({
    chains: allChains as readonly [Chain, ...Chain[]],

    // Use RPC overrides from config that are set to construct clients
    client: ({ chain }) => {
      const rpcOverride = config.rpcOverrideByChainId[chain.id]
      const transport = rpcOverride ? http(rpcOverride) : http()
      return createPublicClient({ chain, transport })
    },

    connectors: [
      devAccount(defaultDevAccount),
      walletConnect({
        projectId: envVars.VITE_WALLET_CONNECT_PROJECT_ID || '',
      }),
      metaMask(),
    ],
  })
}
