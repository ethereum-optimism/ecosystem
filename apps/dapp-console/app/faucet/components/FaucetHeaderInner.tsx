import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@eth-optimism/ui-components/src/components/ui/dialog/dialog'
import { LearnMoreDialogContent } from '@/app/faucet/components/LearnMoreDialogContent'
import { usePrivy, useWallets } from '@privy-io/react-auth'

type Props = {
  signedIn: boolean
}

const seeDetails = (
  <DialogTrigger>
    <Text as="span" className="underline hover:no-underline cursor-pointer">
      See details
    </Text>
  </DialogTrigger>
)

const FaucetHeaderInner = ({ signedIn }: Props) => {
  const { connectWallet, login } = usePrivy()
  const { wallets } = useWallets()
  const connectedWallet = wallets.find((w) => w.walletClientType !== 'privy') // Exclude Privy wallet

  let content = null
  if (!signedIn) {
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
        <Button onClick={login}>Sign in</Button>
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
        <div className="flex gap-2">
          <Button onClick={connectWallet} variant="secondary">
            Connect wallet
          </Button>
          <Button onClick={connectWallet} variant="secondary">
            Login with World ID
          </Button>
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
        <div className="flex gap-2">
          <Button onClick={connectWallet} variant="outline">
            Try another wallet
          </Button>
          <Button onClick={connectWallet} variant="secondary">
            Login with World ID
          </Button>
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
