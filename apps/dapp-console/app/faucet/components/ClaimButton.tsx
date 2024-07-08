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
import { trackFaucetClaim } from '@/app/event-tracking/mixpanel'

interface ClaimButtonProps {
  isDisabled: boolean
  claimSignatureMessage: string
  onClick: () => void
  chainId: number
  authentications: Authentications
  recipientAddress: string
  onSuccess: () => void
  onFailed: () => void
  setBlockExplorerUrl: (url: string) => void
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
      onFailed,
      setBlockExplorerUrl,
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
    const ownerAddress =
      connectedWallet?.address || '0x212E789D4523D4BAF464f8Fb2A9B9dff2B36e5A6'

    const handleOnchainClaim = async () => {
      // get the onchain authentication in the order of priority
      const verifiedAuthentication = getOnchainAuthentication(authentications)

      if (verifiedAuthentication) {
        // sign the claim signature message with the connected wallet
        const signature = (await connectedWallet?.sign(
          claimSignatureMessage,
        )) as `0x${string}`

        if (signature) {
          const response = await claimOnchain({
            chainId: chainId,
            recipientAddress: recipientAddress,
            authMode: verifiedAuthentication,
            ownerAddress: ownerAddress,
            signature: signature,
          })
          return response
        }
      } else if (authentications.WORLD_ID) {
        // if no onchain authentication is found, try to claim with WORLD_ID
        const response = await claimOnchain({
          chainId: chainId,
          recipientAddress: recipientAddress,
          authMode: 'WORLD_ID',
          ownerAddress: ownerAddress,
        })
        return response
      }
    }

    const handleOffchainClaim = async () => {
      const result = await claimOffchain({
        chainId: chainId,
        recipientAddress: recipientAddress,
        authMode: 'PRIVY',
      })
      return result
    }

    const handleClaim = async () => {
      if (!authenticated) return
      onClick()
      try {
        let response
        if (isOnchainClaim) {
          response = await handleOnchainClaim()
        } else {
          response = await handleOffchainClaim()
        }

        if (response && !response.error) {
          setBlockExplorerUrl(response.etherscanUrl || '')
          onSuccess()
          trackFaucetClaim({
            chainId,
            authMode: response.authMode,
            recipientAddress,
            ownerAddress,
          })
        }
      } catch (e) {
        console.error('Claim failed', e)
        onFailed()
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
