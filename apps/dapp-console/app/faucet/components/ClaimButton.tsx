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
      // get the onchain authentication in the order of priority
      const verifiedAuthentication = getOnchainAuthentication(authentications)
      if (verifiedAuthentication) {
        // sign the claim signature message with the connected wallet
        const signature = (await connectedWallet?.sign(
          claimSignatureMessage,
        )) as `0x${string}`
        if (signature) {
          claimOnchain({
            chainId: chainId,
            recipientAddress: recipientAddress,
            authMode: verifiedAuthentication,
            ownerAddress: ownerAddress,
          })
        }
      } else if (authentications.WORLD_ID) {
        // if no onchain authentication is found, try to claim with WORLD_ID
        claimOnchain({
          chainId: chainId,
          recipientAddress: recipientAddress,
          authMode: 'WORLD_ID',
          ownerAddress: ownerAddress,
        })
      }
    }

    const handleOffchainClaim = async () => {
      const result = await claimOffchain({
        chainId: chainId,
        recipientAddress: recipientAddress,
        authMode: 'PRIVY',
      })

      console.log(result)
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
        const interval = setTimeout(() => {
          onSuccess()
        }, 3000)
        return () => clearInterval(interval)
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
