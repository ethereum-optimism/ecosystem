'use client'

import { WalletWithMetadata, usePrivy } from '@privy-io/react-auth'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { LinkedWallet } from '@/app/settings/components/LinkedWallet'

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
      <Text className="font-semibold text-lg">Your Wallets</Text>
      {linkedWallets.map((wallet) => (
        <LinkedWallet
          key={wallet.address}
          wallet={wallet}
          onUnlink={(wallet) => unlinkWallet(wallet.address)}
        />
      ))}
      <Button
        onClick={linkWallet}
        className="font-medium mt-8 px-14 py-2 gap-2 w-[88px]"
      >
        Link Wallet
      </Button>
    </div>
  )
}
