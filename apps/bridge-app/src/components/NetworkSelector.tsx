import { useAccount, useConfig, useSwitchChain } from 'wagmi'
import {
  Button,
  Separator,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@eth-optimism/ui-components'

import { Check } from 'lucide-react'
import { Chain } from 'viem'
import { useCallback, useState } from 'react'
import { networkPairsByID } from '@eth-optimism/op-app'

import l1AssetLogo from '@/assets/l1-asset-logo.png'
import l2AssetLogo from '@/assets/l2-asset-logo.png'
import { useTheme } from '@/providers/ThemeProvider'

type NetworkSelectorItemProps = {
  chain: Chain
  logo: string
  isActive: boolean
  onSelect: (chain: Chain) => void
}

const NetworkSelectorItem = ({
  chain,
  isActive,
  logo,
  onSelect,
}: NetworkSelectorItemProps) => {
  return (
    <div
      className="flex flex-row p-3 cursor-pointer max-h-12 hover:bg-accent"
      onClick={() => onSelect(chain)}
    >
      <Check className={isActive ? 'visible' : 'invisible'} />
      <div className="flex items-center flex-row ml-3">
        <img className="h-full" src={logo} />{' '}
        <span className="text-base ml-3">{chain.name}</span>
      </div>
    </div>
  )
}

export const NetworkSelector = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const config = useConfig()
  const { theme } = useTheme()
  const { chain } = useAccount()
  const { switchChainAsync } = useSwitchChain()

  const mainnets = config.chains.filter((chain) => !chain.testnet)
  const testnets = config.chains.filter((chain) => chain.testnet)

  const onSwitchNetwork = useCallback(
    async (selectedChain: Chain) => {
      await switchChainAsync({ chainId: selectedChain.id })
      setDialogOpen(false)
    },
    [switchChainAsync, setDialogOpen],
  )

  const isL2 = Boolean(networkPairsByID[chain?.id ?? 0])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex flex-row h-12">
          <img
            className="h-3/4 rounded-full"
            src={isL2 ? l2AssetLogo : l1AssetLogo}
          />{' '}
          <span className="ml-2 hidden md:inline">{chain?.name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-auto">
        <DialogHeader>Select Network</DialogHeader>
        <DialogDescription>
          <span className="text-base mb-2">Mainnets:</span>
          {mainnets.map((mainnet) => (
            <NetworkSelectorItem
              key={mainnet.id}
              chain={mainnet}
              logo={networkPairsByID[mainnet.id] ? l2AssetLogo : l1AssetLogo}
              isActive={chain?.id === mainnet.id}
              onSelect={onSwitchNetwork}
            />
          ))}
        </DialogDescription>
        <Separator />
        <DialogDescription>
          <span className="text-base mb-2">Testsnets:</span>
          {testnets.map((testnet) => (
            <NetworkSelectorItem
              key={testnet.id}
              chain={testnet}
              logo={networkPairsByID[testnet.id] ? l2AssetLogo : l1AssetLogo}
              isActive={chain?.id === testnet.id}
              onSelect={onSwitchNetwork}
            />
          ))}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
