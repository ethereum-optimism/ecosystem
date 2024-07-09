import { Card, CardHeader, CardTitle, Text } from '@eth-optimism/ui-components'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useCallback, useEffect } from 'react'
import { Chain } from 'viem'
import { useAccount, useSwitchChain, useWalletClient } from 'wagmi'

export type SupportedNetworkProps = {
  chains: Chain[]
  children: React.ReactNode
}

const NETWORK_NOT_FOUND_CODES = [4902, -32602]

export const SupportedNetworks = ({
  chains,
  children,
}: SupportedNetworkProps) => {
  const { chainId, isDisconnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { switchChainAsync } = useSwitchChain()
  const walletClient = useWalletClient()

  useEffect(() => {
    if (isDisconnected) {
      openConnectModal?.()
    }
  }, [openConnectModal, isDisconnected])

  const handleNetworkSwitch = useCallback(
    async (chain: Chain) => {
      try {
        await switchChainAsync({ chainId: chain.id })
      } catch (e) {
        if (NETWORK_NOT_FOUND_CODES.includes(e.cause.code)) {
          walletClient.data?.addChain({ chain })
        }
      }
    },
    [switchChainAsync, walletClient],
  )

  if (!chainId) {
    return
  }

  return chains.find((chain) => chain.id === chainId) ? (
    children
  ) : (
    <div className="fle flex-col text-center">
      <Text className="text-xl font-semibold">
        Please Select a Supported Network
      </Text>
      <div className="flex flex-row flex-wrap py-6">
        {chains.map((chain) => (
          <Card
            className="cursor-pointer w-full text-center"
            onClick={() => handleNetworkSwitch(chain)}
          >
            <CardHeader>
              <CardTitle>{chain.name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
