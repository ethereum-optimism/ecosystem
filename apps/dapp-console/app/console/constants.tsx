import { Button } from '@eth-optimism/ui-components/src/components/ui/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import { DialogMetadata } from '@/app/console/useDialogContent'

// Build Section
export const testnetPaymasterMetadata: DialogMetadata = {
  label: 'Testnet Paymaster',
  title:
    'Get your testnet transactions sponsored to remove friction from your dapp experience',
  description:
    'Continue to Github for information on how to setup and use the Testnet Paymaster.',
  primaryButton: (
    <Button asChild>
      <a href="">
        <Text as="span">View on Github</Text>
      </a>
    </Button>
  ),
  secondaryButton: (
    <Button asChild variant="secondary">
      <a href="">
        <Text as="span">Learn about paymasters</Text>
      </a>
    </Button>
  ),
}

export const uxReviewMetadata: DialogMetadata = {
  label: 'UX Review',
  title:
    'Get actionable feedback from Superchain pros to get your dapp ready for launch',
  description:
    'Technical builders from Superchain teams are standing by to review your dapp. Whether you’re building DeFi, DeSo, Infra, or anything else, we’ll connect you with people who get it.',
  primaryButton: (
    <Button asChild>
      <a href="">
        <Text as="span">Apply</Text>
      </a>
    </Button>
  ),
}

export const superchainSafeMetadata: DialogMetadata = {
  label: 'Superchain Safe',
  title: 'Get multisig support on any OP Chain in the Superchain with Safe',
  description:
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.',
  primaryButton: (
    <Button asChild>
      <a href="">
        <Text as="span">Get safe for Base or Optimism</Text>
      </a>
    </Button>
  ),
  secondaryButton: (
    <Button asChild variant="secondary">
      <a href="">
        <Text as="span">Get safe for any other chain</Text>
      </a>
    </Button>
  ),
}

// Launch & Grow Section
export const deploymentRebateMetadata: DialogMetadata = {
  label: 'Deployment Rebate',
  title:
    'Launch on the Superchain and get your deployment costs covered up to $200',
  description:
    'Get your app up and running without having to worry about deployment fees.',
  primaryButton: (
    <Button asChild>
      <a href="">
        <Text as="span">Apply</Text>
      </a>
    </Button>
  ),
}

export const mainnetPaymasterMetadata: DialogMetadata = {
  label: 'Paymaster',
  title:
    'Get up to $500 in free gas for your users when you use the Superchain Paymaster',
  description:
    'Optimism will sponsor your mainnet transactions to help you attract users and grow your product.',
  primaryButton: (
    <Button asChild>
      <a href="">
        <Text as="span">Join waitlist</Text>
      </a>
    </Button>
  ),
  secondaryButton: (
    <Button asChild variant="secondary">
      <a href="">
        <Text as="span">Learn about paymasters</Text>
      </a>
    </Button>
  ),
}

export const megaphoneMetadata: DialogMetadata = {
  label: 'Megaphone',
  title: 'Amplify your launch through Superchain marketing channels',
  description:
    'When you’re ready, Superchain teams will communicate your launch to audiences across X, Farcaster, and other marketing channels.',
  primaryButton: (
    <Button asChild>
      <a href="">
        <Text as="span">Apply</Text>
      </a>
    </Button>
  ),
}

export const userFeedbackMetadata: DialogMetadata = {
  label: 'User Feedback',
  title:
    'Get actionable feedback from Superchain contributors to improve your app',
  description:
    'Passionate contributors from Superchain communities, like Base and Optimism, are standing by to provide feedback on any topic.',
  primaryButton: (
    <Button asChild>
      <a href="">
        <Text as="span">Apply</Text>
      </a>
    </Button>
  ),
}

// Promo Section
export const gelatoMetadata: DialogMetadata = {
  label: 'Gelato',
  title: 'Get $50/month in credits for up to 3 months',
  description:
    'Gelato is a protocol that automates smart contract executions on Ethereum. Use Gelato to automate your dapp and save on gas fees.',
  bannerImage: '/banners/gelato-banner.png',
  primaryButton: (
    <Button asChild>
      <a href="">
        <Text as="span">Apply</Text>
      </a>
    </Button>
  ),
  secondaryButton: (
    <Button asChild variant="secondary">
      <a href="">
        <Text as="span">See offer details</Text>
      </a>
    </Button>
  ),
}

export const moralisMetadata: DialogMetadata = {
  label: 'Moralis',
  title: 'Get $50/month in credits for up to 3 months',
  description:
    'Moralis is a protocol that automates smart contract executions on Ethereum. Use Moralis to automate your dapp and save on gas fees.',
  bannerImage: '/banners/moralis-banner.png',
  primaryButton: (
    <Button asChild>
      <a href="">
        <Text as="span">Apply</Text>
      </a>
    </Button>
  ),
  secondaryButton: (
    <Button asChild variant="secondary">
      <a href="">
        <Text as="span">See offer details</Text>
      </a>
    </Button>
  ),
}

export const quicknodeMetadata: DialogMetadata = {
  label: 'Quicknode',
  title: 'Get $50/month in credits for up to 3 months',
  description:
    'Quicknode is a protocol that automates smart contract executions on Ethereum. Use Quicknode to automate your dapp and save on gas fees.',
  bannerImage: '/banners/quicknode-banner.png',
  primaryButton: (
    <Button asChild>
      <a href="">
        <Text as="span">Apply</Text>
      </a>
    </Button>
  ),
  secondaryButton: (
    <Button asChild variant="secondary">
      <a href="">
        <Text as="span">See offer details</Text>
      </a>
    </Button>
  ),
}

export const thirdWebMetadata: DialogMetadata = {
  label: 'Third Web',
  title: 'Get $50/month in credits for up to 3 months',
  description:
    'Third Web is a protocol that automates smart contract executions on Ethereum. Use Third Web to automate your dapp and save on gas fees.',
  bannerImage: '/banners/thirdweb-banner.png',
  primaryButton: (
    <Button asChild>
      <a href="">
        <Text as="span">Apply</Text>
      </a>
    </Button>
  ),
  secondaryButton: (
    <Button asChild variant="secondary">
      <a href="">
        <Text as="span">See offer details</Text>
      </a>
    </Button>
  ),
}
