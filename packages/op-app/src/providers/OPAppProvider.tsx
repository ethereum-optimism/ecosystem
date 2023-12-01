import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { Transport } from 'viem'
import type { Chain } from 'viem/chains'
import type { Config, CreateConfigParameters,CreateConnectorFn } from 'wagmi'
import { createConfig,http, WagmiProvider } from 'wagmi'

import { networkPairsByGroup } from '../configs/networkPairs'
import type { NetworkType } from '../types'
import { NetworkProvider } from './NetworkProvider'

export type OPAppProviderProps = {
    type?: NetworkType
    wagmiConfig?: CreateConfigParameters
    connectors?: CreateConnectorFn[]
    children: React.ReactNode
}

type CreateWagmiConfig = {
    type: NetworkType
    connectors?: CreateConnectorFn[]
}

const queryClient = new QueryClient() 

const createWagmiConfigFromType = ({
    type,
    connectors,
}: CreateWagmiConfig): Config => {
    let supportedChains = [] as Chain[]

    if (networkPairsByGroup[type]) {
        supportedChains = Object.values(networkPairsByGroup[type]).flat()
    } else {
        throw new Error('NetworkType not found!')
    }

    return createConfig({
        chains: [supportedChains[0], ...supportedChains.slice(1)],
        connectors: connectors,
        transports: supportedChains.reduce((acc, chain) => {
            acc[chain.id] = http()
            return acc
        }, {} as Record<number, Transport>)
    })
}

export const OPAppProvider = ({
    children,
    connectors,
    wagmiConfig,
    type = 'op',
}: OPAppProviderProps) => {
    const config = useMemo<Config>(() => {
        if (!type && !wagmiConfig) {
            throw new Error('type of wagmiConfig must be supplied')
        }
        return wagmiConfig ? createConfig(wagmiConfig) : createWagmiConfigFromType({ type, connectors })
    }, [type, wagmiConfig])

    return (
        <WagmiProvider reconnectOnMount config={config}>
            <QueryClientProvider client={queryClient}>
                <NetworkProvider type={type}>
                    {children}
                </NetworkProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
