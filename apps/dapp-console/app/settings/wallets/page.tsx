'use client'

import { User, Wallet, useLinkAccount, usePrivy } from '@privy-io/react-auth'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { LinkedWallet } from '@/app/settings/components/LinkedWallet'
import { useCallback, useMemo, useState } from 'react'
import { apiClient } from '@/app/helpers/apiClient'
import { Address } from 'viem'
import { captureError } from '@/app/helpers/errorReporting'
import { LONG_DURATION } from '@/app/constants/toast'
import { toast } from '@eth-optimism/ui-components'
import { RiLoader4Line } from '@remixicon/react'
import {
  trackAddActionClick,
  trackAddActionConfirm,
  trackDeleteActionClick,
  trackDeleteActionConfirm,
  trackWalletConnectorType,
} from '@/app/event-tracking/mixpanel'

export default function Wallets() {
  const { ready, unlinkWallet, user } = usePrivy()

  const [isLoadingWallets, setIsLoadingWallets] = useState(false)

  const { data: walletRes, refetch: fetchWallets } =
    apiClient.wallets.listWallets.useQuery({})

  const { mutateAsync: syncWallets } =
    apiClient.wallets.syncWallets.useMutation()

  const privyLinkedWallets = useMemo(() => {
    const wallets = user?.linkedAccounts.filter(
      (account) => account.type === 'wallet',
    ) as Wallet[]
    return new Set(wallets?.map((wallet) => wallet.address.toLowerCase()))
  }, [user])

  const linkedWallets = useMemo(() => {
    return walletRes?.records.filter((wallet) =>
      privyLinkedWallets.has(wallet.address.toLowerCase()),
    )
  }, [walletRes, privyLinkedWallets])

  const handleLinkWallet = useCallback(
    async (user: User) => {
      setIsLoadingWallets(true)

      try {
        await syncWallets()
        await fetchWallets()

        toast({
          description: 'Address Linked',
          duration: LONG_DURATION,
        })

        trackAddActionConfirm('wallet')

        // user.wallet is the users last linked wallet
        if (user.wallet?.connectorType) {
          trackWalletConnectorType(user.wallet?.connectorType)
        }
      } catch (e) {
        captureError(e, 'linkWallet')
      }

      setIsLoadingWallets(false)
    },
    [syncWallets, fetchWallets, setIsLoadingWallets],
  )

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

        trackDeleteActionConfirm('wallet')
      } catch (e) {
        captureError(e, 'unlinkWallet')
      }
    },
    [syncWallets, unlinkWallet],
  )

  const { linkWallet } = useLinkAccount({
    onSuccess: handleLinkWallet,
  })

  const handleLinkWalletClick = useCallback(() => {
    trackAddActionClick('wallet')
    linkWallet()
  }, [linkWallet])

  const handleUnlinkWalletClick = useCallback(
    async (address: Address) => {
      trackDeleteActionClick('wallet')
      handleUnlinkWallet(address)
    },
    [handleLinkWallet],
  )

  if (!ready) {
    // TODO: Add skeleton
    return <div>loading</div>
  }

  return (
    <div className="flex flex-col">
      <Text className="font-semibold text-lg">Your Wallets</Text>
      <div className="flex flex-col pt-3 space-y-6">
        {linkedWallets?.map((wallet) => (
          <LinkedWallet
            key={wallet.id}
            id={wallet.id}
            address={wallet.address}
            isCbVerified={wallet.verifications.isCbVerified ?? false}
            onUnlink={() => handleUnlinkWalletClick(wallet.address)}
          />
        ))}
      </div>
      <Button
        onClick={handleLinkWalletClick}
        className="font-medium mt-8 px-8 py-2 gap-2 self-start"
      >
        Link Wallet{' '}
        {isLoadingWallets ? (
          <RiLoader4Line className="ml-2 animate-spin" />
        ) : undefined}
      </Button>
    </div>
  )
}
