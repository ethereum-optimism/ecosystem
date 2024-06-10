import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Authentications } from '@/app/faucet/types'
import { faucetRoutes } from '@/app/constants'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@eth-optimism/ui-components/src/components/ui/dialog/dialog'
import { LearnMoreDialogContent } from '@/app/faucet/components/LearnMoreDialogContent'
import { AuthenticationCard } from '@/app/faucet/components/AuthenticationCard'
import { usePrivy, useWallets } from '@privy-io/react-auth'

type Props = {
  signedIn: boolean
  authentications: Authentications
}

const seeDetails = (
  <DialogTrigger>
    <Text as="span" className="underline hover:no-underline cursor-pointer">
      See details
    </Text>
  </DialogTrigger>
)

const FaucetHeaderInner = ({ signedIn, authentications }: Props) => {
  const { connectWallet, login } = usePrivy()
  const { wallets } = useWallets()
  const connectedWallet = wallets.find((w) => w.walletClientType !== 'privy') // Exclude Privy wallet

  // Swap this logic out for checking authentication endpoints
  const hasAuthentication = Object.values(authentications).some(Boolean)

  const onchainVerificationErrorMessage =
    connectedWallet && !hasAuthentication ? (
      <span className="text-red-500">
        Your connected wallet does not meet the requirements for onchain
        verification.
      </span>
    ) : null

  const connectWalletButtonText = connectedWallet
    ? 'Try another wallet'
    : 'Connect wallet'

  const onchainVerificationCard = (
    <AuthenticationCard
      variant="onchain-verification"
      errorMessage={onchainVerificationErrorMessage}
      button={
        <div className="flex gap-4 flex-col sm:flex-row">
          <Button className="w-full sm:w-fit" onClick={connectWallet}>
            {connectWalletButtonText}
          </Button>
          {onchainVerificationErrorMessage && (
            <DialogTrigger>
              <Button className="w-full sm:w-fit" variant="outline">
                Learn more
              </Button>
            </DialogTrigger>
          )}
        </div>
      }
    />
  )

  const worldIdCard = (
    <AuthenticationCard
      variant="world-id"
      button={
        <Button className="bg-black hover:bg-black/90 w-full sm:w-fit">
          Sign in with World ID
        </Button>
      }
    />
  )

  let content = null
  if (!signedIn) {
    // User is not signed in
    content = (
      <>
        <Text as="h3" className="text-base font-semibold mb-2">
          Sign in to use the faucet
        </Text>
        <Text as="p" className="text-base text-secondary-foreground mb-4">
          Anyone can claim 0.05 test ETH on 1 network every 24 hours, or verify
          your onchain identity for more tokens. {seeDetails}
        </Text>
        <Button onClick={login}>Sign in</Button>
      </>
    )
  } else {
    // User is signed in, but no wallet is connected
    content = (
      <>
        <div className="flex flex-col gap-4">
          {onchainVerificationCard}
          {worldIdCard}
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
