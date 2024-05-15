import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import {
  RiArrowLeftFill,
  RiArrowRightLine,
  RiArrowRightSLine,
} from '@remixicon/react'

type FaucetHeaderProps = {
  signedIn: boolean
  wallet: any
  authentications: string[] | null
}

const seeDetailsLink = <a href="#">See details</a>

const FaucetHeader = ({
  signedIn,
  wallet,
  authentications,
}: FaucetHeaderProps) => {
  const renderHeader = () => {
    if (!signedIn) {
      // User is not signed in
      return (
        <div>
          <Text as="h3" className="text-base font-semibold mb-2">
            Sign in to use the faucet
          </Text>
          <Text as="p" className="text-base text-secondary-foreground mb-4">
            After sign in, verify your onchain identity and claim 1 test ETH on
            1 network every 24 hours. {seeDetailsLink}
          </Text>
          <Button>Sign in</Button>
        </div>
      )
    } else if (!wallet) {
      // User is signed in, but no wallet is connected
      return (
        <div>
          <Text as="h3" className="text-base font-semibold mb-2">
            Get maximum testnet tokens
          </Text>
          <Text as="p" className="text-base text-secondary-foreground mb-4">
            Verify your onchain identity with Coinbase Verification, World ID,
            Gitcoin, or attestations to increase your daily ETH allowance.{' '}
            {seeDetailsLink}
          </Text>
          <Button>Connect Wallet</Button>
        </div>
      )
    } else if (wallet && !authentications) {
      // User is signed in and wallet is connected, but no authentications
      return (
        <div>
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
            <Button variant="link" size="sm" className="text-accent-foreground">
              See details <RiArrowRightSLine size={18} />
            </Button>
          </div>
          <Button variant="secondary">Disconnect</Button>
        </div>
      )
    }
  }

  return (
    <div>
      {authentications ? (
        <>
          <Text as="h3" className="text-base font-semibold mb-2">
            Get maximum testnet tokens
          </Text>
          <Text as="p" className="text-base text-secondary-foreground mb-4">
            After sign in, verify your onchain identity and claim 1 test ETH on
            1 network every 24 hours. See details
          </Text>
        </>
      ) : (
        <div className="flex items-start gap-4">
          {renderHeader()}
          <div>images</div>
        </div>
      )}
    </div>
  )
}

export { FaucetHeader }
