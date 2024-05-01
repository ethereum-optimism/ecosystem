'use client'

import { useLinkAccount, usePrivy } from '@privy-io/react-auth'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { LinkedWallet } from '@/app/settings/components/LinkedWallet'
import { useCallback } from 'react'
import { apiClient } from '@/app/helpers/apiClient'
import { Address } from 'viem'
import { captureError } from '@/app/helpers/errorReporting'
import { LONG_DURATION } from '@/app/constants/toast'
import { toast } from '@eth-optimism/ui-components'

export default function Wallets() {
  const { ready, unlinkWallet } = usePrivy()

  const { data: walletRes, refetch: fetchWallets } =
    apiClient.wallets.listWallets.useQuery({})

  const { mutateAsync: syncWallets } =
    apiClient.wallets.syncWallets.useMutation()

  const handleLinkWallet = useCallback(async () => {
    try {
      await syncWallets()
      await fetchWallets()

      toast({
        description: 'Address Linked',
        duration: LONG_DURATION,
      })
    } catch (e) {
      captureError(e, 'linkWallet')
    }
  }, [syncWallets, fetchWallets])

  const handleUnlinkWallet = useCallback(
    async (address: Address) => {
      try {
        await unlinkWallet(address)
        await syncWallets()
        await fetchWallets()

        toast({
          description: 'Address Unlinked',
          duration: LONG_DURATION,
        })
      } catch (e) {
        captureError(e, 'unlinkWallet')
      }
    },
    [syncWallets, unlinkWallet],
  )

  const { linkWallet } = useLinkAccount({
    onSuccess: handleLinkWallet,
  })

  if (!ready) {
    // TODO: Add skeleton
    return <div>loading</div>
  }

  return (
    <div className="flex flex-col">
      <Text className="font-semibold text-lg">Your Wallets</Text>
      <div className="flex flex-col pt-3 space-y-6">
        {walletRes?.records.map((wallet) => (
          <LinkedWallet
            key={wallet.id}
            id={wallet.id}
            address={wallet.address}
            isCbVerified={wallet.verifications.isCbVerified ?? false}
            onUnlink={() => handleUnlinkWallet(wallet.address)}
          />
        ))}
      </div>
      <Button
        onClick={linkWallet}
        className="font-medium mt-8 px-14 py-2 gap-2 w-[88px]"
      >
        Link Wallet
      </Button>
    </div>
  )
}
