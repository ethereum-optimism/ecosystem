import { apiClient } from '@/app/helpers/apiClient'
import { useConnectedWallet } from '@/app/hooks/useConnectedWallet'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { usePrivy } from '@privy-io/react-auth'
import { forwardRef } from 'react'
import { Authentications } from '@/app/faucet/types'
import {
  getOnchainAuthentication,
  hasAuthentication,
} from '@/app/faucet/helpers'

interface ClaimButtonProps {
  isDisabled: boolean
  claimSignatureMessage: string
  onClick: () => void
  chainId: number
  authentications: Authentications
  recipientAddress: string
  onSuccess: () => void
  children: React.ReactNode
}

const ClaimButton = forwardRef<HTMLButtonElement, ClaimButtonProps>(
  (
    {
      isDisabled,
      claimSignatureMessage,
      onClick,
      chainId,
      authentications,
      recipientAddress,
      onSuccess,
      children,
    },
    ref,
  ) => {
    const { connectedWallet } = useConnectedWallet()
    const { authenticated } = usePrivy()

    const { mutateAsync: claimOnchain } =
      apiClient.faucet.onChainClaims.useMutation()

    const { mutateAsync: claimOffchain } =
      apiClient.faucet.offChainClaims.useMutation()

    const isOnchainClaim = hasAuthentication(authentications)
    const ownerAddress = connectedWallet?.address || ''

    const handleOnchainClaim = async () => {
      if (authentications.WORLD_ID) {
        claimOnchain({
          chainId: chainId,
          recipientAddress: recipientAddress,
          authMode: 'WORLD_ID',
          ownerAddress: ownerAddress,
        })
      } else {
        const verifiedAuthentication = getOnchainAuthentication(authentications)
        const signature = (await connectedWallet?.sign(
          claimSignatureMessage,
        )) as `0x${string}`

        if (signature && verifiedAuthentication) {
          claimOnchain({
            chainId: chainId,
            recipientAddress: recipientAddress,
            authMode: verifiedAuthentication,
            ownerAddress: ownerAddress,
            signature: signature,
          })
        }
      }
    }

    const handleOffchainClaim = async () => {
      await claimOffchain({
        chainId: chainId,
        recipientAddress: recipientAddress,
        authMode: 'PRIVY',
      })
    }

    const handleClaim = async () => {
      if (!authenticated) return
      onClick()
      try {
        if (isOnchainClaim) {
          await handleOnchainClaim()
        } else {
          await handleOffchainClaim()
        }
        onSuccess()
      } catch (e) {
        console.error(e)
      }
    }

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        className="w-full"
        onClick={handleClaim}
      >
        {children}
      </Button>
    )
  },
)

export { ClaimButton }
