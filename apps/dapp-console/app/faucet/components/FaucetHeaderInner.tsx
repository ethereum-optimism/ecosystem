'use client'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@eth-optimism/ui-components/src/components/ui/dialog/dialog'
import { LearnMoreDialogContent } from '@/app/faucet/components/LearnMoreDialogContent'
import { usePrivy } from '@privy-io/react-auth'
import { useAuth } from '@/app/hooks/useAuth'
import { useConnectedWallet } from '@/app/hooks/useConnectedWallet'
import type { ISuccessResult } from '@worldcoin/idkit'
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit'
import { apiClient } from '@/app/helpers/apiClient'
import { useState } from 'react'

const seeDetails = (
  <DialogTrigger>
    <Text as="span" className="underline hover:no-underline cursor-pointer">
      See details
    </Text>
  </DialogTrigger>
)

const FaucetHeaderInner = () => {
  const { connectWallet, authenticated } = usePrivy()
  const { connectedWallet } = useConnectedWallet()
  const { login } = useAuth()

  const [isVerifyingWorldID, setIsVerifyingWorldID] = useState(false)
  const { mutateAsync: verifyWorldIdProof } =
    apiClient.auth.worldIdVerify.useMutation({
      onMutate: () => {
        setIsVerifyingWorldID(true)
      },
      onSettled: () => {
        setIsVerifyingWorldID(false)
      },
      onSuccess: () => {
        // Handle success case
        setIsVerifyingWorldID(false)
        // TODO: Handle reload for worldID check
        // Refetch worldID user data to update the state based on the new verification
        // refetch()
      },
      onError: () => {
        setIsVerifyingWorldID(false)
        console.error('An error occurred while verifying WorldID')
      },
    })

  const verifyWorldId = async (result: ISuccessResult) => {
    try {
      await verifyWorldIdProof({
        merkle_root: result.merkle_root,
        nullifier_hash: result.nullifier_hash,
        proof: result.proof,
        verification_level: result.verification_level,
      })
    } catch (error) {
      console.error('Error in verifyWorldId function:', error)
      throw error
    }
  }
  // This function is required by IDKit but is not needed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSuccess = async (result: ISuccessResult) => {}


  const handleLogin = () => {
    login()
  }

  let content = null
  if (!authenticated) {
    // User is not signed in
    content = (
      <>
        <Text as="h3" className="text-base font-semibold mb-1">
          Sign in to use the faucet
        </Text>
        <Text as="p" className="text-base text-secondary-foreground mb-4">
          Anyone can claim 0.05 test ETH on 1 network every 24 hours, or verify
          your onchain identity for more tokens. {seeDetails}
        </Text>
        <Button onClick={handleLogin}>Sign in</Button>
      </>
    )
  } else if (!connectedWallet) {
    // User is signed in, but no wallet is connected
    content = (
      <>
        <Text as="h3" className="text-base font-semibold mb-1">
          You can claim 0.05 test ETH on 1 network every 24 hours{' '}
        </Text>
        <Text as="p" className="text-base text-secondary-foreground mb-4">
          Want more tokens? Verify your onchain identity with Gitcoin, Coinbase
          Verification, World ID, or attestations. {seeDetails}
        </Text>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={connectWallet} variant="secondary">
            Connect wallet
          </Button>
          <IDKitWidget
              app_id={process.env.NEXT_WORLDID_APP_ID as `app_${string}`}
              action={process.env.NEXT_WORLDID_ACTION_NAME as string}
              onSuccess={onSuccess}
              handleVerify={verifyWorldId}
              verification_level={VerificationLevel.Orb}
            >
            {({ open }: { open: () => void }) => (
              <Button onClick={open} variant="secondary">
                Login with World ID
              </Button>
            )}
          </IDKitWidget>
          {isVerifyingWorldID && <div>Loading</div>}
        </div>
      </>
    )
  } else {
    // User is signed in and a wallet is connected, but no authentication
    content = (
      <>
        <Text as="h3" className="text-base font-semibold mb-1">
          Your connected wallet doesn’t have onchain identity
        </Text>
        <Text as="p" className="text-base text-secondary-foreground mb-4">
          You can still claim the minimum amount of 0.05 test ETH on 1 network
          every 24 hours. For more tokens, verify your identity. {seeDetails}
        </Text>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={connectWallet} variant="outline">
            Try another wallet
          </Button>
          <IDKitWidget
              app_id={process.env.NEXT_WORLDID_APP_ID as `app_${string}`}
              action={process.env.NEXT_WORLDID_ACTION_NAME as string}
              onSuccess={onSuccess}
              handleVerify={verifyWorldId}
              verification_level={VerificationLevel.Orb}
            >
            {({ open }: { open: () => void }) => (
              <Button onClick={open} variant="secondary">
                Login with World ID
              </Button>
            )}
          </IDKitWidget>
          {isVerifyingWorldID && <div>Loading</div>}
        </div>
      </>
    )
  }

  return (
    <div className="w-full">
      <Dialog>
        {content}
        <DialogContent>
          <LearnMoreDialogContent />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { FaucetHeaderInner }
