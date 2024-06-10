import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { RiArrowRightSLine } from '@remixicon/react'
import { Authentications } from '@/app/faucet/types'
import { faucetRoutes } from '@/app/constants'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@eth-optimism/ui-components/src/components/ui/dialog/dialog'
import { LearnMoreDialogContent } from '@/app/faucet/components/LearnMoreDialogContent'

type Props = {
  signedIn: boolean
  wallet: boolean
  authentications: Authentications
}

const seeDetailsLink = (
  <a
    href={faucetRoutes.SEE_DETAILS_URL}
    target="_blank"
    rel="noreferrer"
    className="underline hover:no-underline"
  >
    See details
  </a>
)

const FaucetHeaderInner = ({ signedIn, wallet, authentications }: Props) => {
  const hasAuthentication = Object.values(authentications).some(Boolean)
  let content = null

  if (!signedIn) {
    // User is not signed in
    content = (
      <>
        <Text as="h3" className="text-base font-semibold mb-2">
          Sign in to use the faucet
        </Text>
        <Text as="p" className="text-base text-secondary-foreground mb-4">
          After sign in, verify your onchain identity and claim 1 test ETH on 1
          network every 24 hours. {seeDetailsLink}
        </Text>
        <Button>Sign in</Button>
      </>
    )
  } else if (!wallet) {
    // User is signed in, but no wallet is connected
    content = (
      <>
        <Text as="h3" className="text-base font-semibold mb-2">
          Get maximum testnet tokens
        </Text>
        <Text as="p" className="text-base text-secondary-foreground mb-4">
          Verify your onchain identity with Coinbase Verification, World ID,
          Gitcoin, or attestations to increase your daily ETH allowance.{' '}
          {seeDetailsLink}
        </Text>
        <Button>Connect Wallet</Button>
      </>
    )
  } else if (wallet && !hasAuthentication) {
    // User is signed in and wallet is connected, but no authentications
    content = (
      <>
        <Text as="h3" className="text-base font-semibold mb-2">
          Your connected wallet doesn’t have onchain identity
        </Text>
        <Text as="p" className="text-base text-secondary-foreground">
          You can claim the minimum amount of 0.05 test ETH on 1 network every
          24 hours.
        </Text>
        <div className="flex items-center mb-4">
          <Text as="p" className="text-sm text-secondary-foreground">
            For more tokens, verify your onchain identity.
          </Text>
          <DialogTrigger asChild>
            <Button variant="link" size="sm" className="text-accent-foreground">
              Learn more <RiArrowRightSLine size={18} />
            </Button>
          </DialogTrigger>
        </div>
        <Button variant="secondary">Disonnect</Button>
      </>
    )
  }

  return (
    <div>
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
