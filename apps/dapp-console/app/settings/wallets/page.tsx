'use client'

import { WalletWithMetadata, usePrivy } from '@privy-io/react-auth'
import { RiAddLine, RiCloseLine } from '@remixicon/react'

import { Button } from '@eth-optimism/ui-components/src/components/ui/button'
import { Input } from '@eth-optimism/ui-components/src/components/ui/input'

type LinkedWalletProps = {
  wallet: WalletWithMetadata
  onUnlink: (wallet: WalletWithMetadata) => void
}

const LinkedWallet = ({ wallet, onUnlink }: LinkedWalletProps) => (
  <div className="flex flex-row gap-2">
    <Input value={wallet.address} disabled />
    <Button variant="secondary" size="icon" onClick={() => onUnlink(wallet)}>
      <RiCloseLine />
    </Button>
  </div>
)

export default function Wallets() {
  const { ready, linkWallet, unlinkWallet, user } = usePrivy()

  if (!ready) {
    // TODO: Add skeleton
    return <div>loading</div>
  }

  const linkedWallets = user?.linkedAccounts.filter(
    (account) => account.type == 'wallet',
  ) as WalletWithMetadata[]

  return (
    <div className="flex flex-col">
      {linkedWallets.map((wallet) => (
        <LinkedWallet
          key={wallet.address}
          wallet={wallet}
          onUnlink={(wallet) => unlinkWallet(wallet.address)}
        />
      ))}
      <Button
        onClick={linkWallet}
        className="mt-8 gap-2 w-[88px]"
        variant="secondary"
      >
        <RiAddLine /> Add
      </Button>
    </div>
  )
}
