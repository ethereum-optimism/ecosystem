import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { FaucetHeaderInner } from '@/app/faucet/components/FaucetHeaderInner'

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
          <LogoChain />
        </div>
      )}
    </div>
  )
}

const LogoChain = () => {
  const images = [
    '/logos/gitcoin-logo.png',
    '/logos/worldid-logo.png',
    '/logos/eas-logo.png',
    '/logos/coinbase-logo.png',
  ]
  return (
    <div className="flex flex-row-reverse">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt="Logo"
          className="w-8 h-8"
          style={{
            zIndex: index,
            marginLeft: index === images.length - 1 ? 0 : '-12px',
          }}
        />
      ))}
    </div>
  )
}

export { FaucetHeader }
