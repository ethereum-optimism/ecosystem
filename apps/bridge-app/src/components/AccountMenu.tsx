import { useAccount, useDisconnect } from 'wagmi'
import { useCallback } from 'react'
import { ExternalLink } from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { shortenAddress, useOPNetwork } from '@eth-optimism/op-app'

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  Separator,
} from '@eth-optimism/ui-components'
import { AccountAvatar } from '@/components/AccountAvatar'
import { NetworkSelector } from '@/components/NetworkSelector'

import { NETWORK_TYPE } from '@/constants/networkType'

export const AccountMenu = () => {
  const { address, chain } = useAccount()
  const { networkPair } = useOPNetwork({
    type: NETWORK_TYPE,
    chainId: chain?.id,
  })
  const { disconnect } = useDisconnect()

  const onDisconnectWallet = useCallback(() => {
    disconnect()
  }, [disconnect])

  return address ? (
    <>
      <div className="w-full h-full md:flex mr-2">
        <NetworkSelector />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-12">
            <span>
              <AccountAvatar />
            </span>
            <span className="ml-2 hidden md:inline">
              {shortenAddress(address)}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Account Info</DialogHeader>

          <div className="account-info-wrapper flex flex-col items-center justify-center w-full">
            <AccountAvatar className="h-32 w-32" />
            <span className="text-lg my-4">{address}</span>
            <Separator />
            <div className="flex flex-col w-full test-base text-left my-4">
              <div className="text-sm">Block Explorers:</div>
              <div className="my-3 w-full hover:bg-accent p-3">
                <a
                  className="flex w-full items-center cursor-pointer"
                  rel="noopener noreferrer"
                  href={`${networkPair.l1?.blockExplorers?.default?.url}/address/${address}`}
                  target="_blank"
                >
                  View L1 Explorer <ExternalLink className="ml-1" size={20} />
                </a>
              </div>
              <div className="w-full hover:bg-accent p-3">
                <a
                  className="flex w-full items-center cursor-pointer"
                  rel="noopener noreferrer"
                  href={`${networkPair.l2?.blockExplorers?.default?.url}/address/${address}`}
                  target="_blank"
                >
                  View L2 Explorer <ExternalLink className="ml-1" size={20} />
                </a>
              </div>
            </div>
            <Separator />
            <Button
              variant="ghost"
              className="w-full mt-4 py-6 text-base"
              onClick={onDisconnectWallet}
            >
              Disconnect Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  ) : (
    <ConnectButton />
  )
}
