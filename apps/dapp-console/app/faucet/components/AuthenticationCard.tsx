import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { LogoChain } from '@/app/faucet/components/LogoChain'

type Props = {
  variant?: 'onchain-verification' | 'world-id'
  errorMessage?: React.ReactNode
  button: React.ReactNode
}

const AuthenticationCard = ({ button, variant, errorMessage }: Props) => {
  const title =
    variant === 'onchain-verification' ? 'Onchain Verification' : 'World ID'

  const description = errorMessage
    ? errorMessage
    : variant === 'onchain-verification'
      ? 'Increase your allowance with Coinbase, EAS or Gitcoin'
      : 'Verify your World ID for up to 1 test ETH per network every 24 hours'

  const icons =
    variant === 'onchain-verification'
      ? [
          '/logos/coinbase-logo.png',
          '/logos/eas-logo.png',
          '/logos/gitcoin-logo.png',
        ]
      : ['/logos/worldid-logo.png']

  return (
    <div className="bg-secondary rounded-md p-4">
      <div className="flex justify-between">
        <div className="mr-2">
          <Text as="h3" className="font-semibold mb-1">
            {title}
          </Text>
          <Text as="p" className="text-sm text-secondary-foreground mb-4">
            {description}
          </Text>
        </div>
        <LogoChain images={icons} />
      </div>
      {button}
    </div>
  )
}

export { AuthenticationCard }
