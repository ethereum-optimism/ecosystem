import { Card, CardHeader, CardTitle, Text } from '@eth-optimism/ui-components'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useCallback, useEffect } from 'react'
import { Chain } from 'viem'
import { useAccount, useSwitchChain } from 'wagmi'

export type SupportedNetworkProps = {
  chains: Chain[]
  children: React.ReactNode
}

export const SupportedNetworks = ({
  chains,
  children,
}: SupportedNetworkProps) => {
  const { chainId, isDisconnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    if (isDisconnected) {
      openConnectModal?.()
    }
  }, [openConnectModal, isDisconnected])

  const handleNetworkSwitch = useCallback(
    (chainId: number) => {
      switchChain({ chainId })
    },
    [switchChain],
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
            onClick={() => handleNetworkSwitch(chain.id)}
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
