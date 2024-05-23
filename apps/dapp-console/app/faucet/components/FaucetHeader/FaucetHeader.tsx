import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { FaucetHeaderInner } from './FaucetHeaderInner'

type FaucetHeaderProps = {
  signedIn: boolean
  wallet: boolean
  authentications: string[] | null
}

const FaucetHeader = ({
  signedIn,
  wallet,
  authentications,
}: FaucetHeaderProps) => {
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
          <FaucetHeaderInner
            signedIn={signedIn}
            wallet={wallet}
            authentications={authentications}
          />
          <div>images</div>
        </div>
      )}
    </div>
  )
}

export { FaucetHeader }
