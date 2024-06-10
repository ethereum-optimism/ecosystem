import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'

const LearnMoreDialogContent = () => {
  const authenticationMethods = [
    {
      label: 'Coinbase Verification',
      description: null,
      image: '/logos/coinbase-logo.png',
      url: '',
    },
    {
      label: 'EAS',
      description: 'Valid within 7 days',
      image: '/logos/eas-logo.png',
      url: '',
    },
    {
      label: 'Gitcoin',
      description: 'Passport score > 25',
      image: '/logos/gitcoin-logo.png',
      url: '',
    },
    {
      label: 'World ID',
      description: null,
      image: '/logos/worldid-logo.png',
      url: '',
    },
  ]
  return (
    <div>
      <Text as="h1" className="text-lg font-semibold">
        Get maximum testnet tokens
      </Text>
      <Text as="p" className="text-muted-foreground">
        Verify your onchain identity to get 1 test ETH on 1 test network every
        24 hours. Superchain faucet supports 4 kinds of onchain identity:
      </Text>
      <div className="flex flex-col py-4 gap-4">
        {authenticationMethods.map((method) => (
          <div
            key={method.label}
            className="flex justify-between items-center gap-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={method.image}
                alt={method.label}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <Text as="p" className="text-base font-semibold">
                  {method.label}
                </Text>
                <Text as="p" className="text-sm text-muted-foreground">
                  {method.description}
                </Text>
              </div>
            </div>
            <Button variant="outline" asChild>
              <a href={method.url} target="_blank" rel="noreferrer noopener">
                <Text as="span">Learn more</Text>
              </a>
            </Button>
          </div>
        ))}
      </div>
      <Text as="p" className="text-sm text-muted-foreground">
        Connect a wallet associated with any of the options above to verify your
        onchain identity. For World ID Orb, click sign in with World ID.
      </Text>
    </div>
  )
}

export { LearnMoreDialogContent }
