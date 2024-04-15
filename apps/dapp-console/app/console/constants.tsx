import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { trackOfferEngaged } from '@/app/event-tracking/mixpanel'
import { externalRoutes, forms, routes } from '@/app/constants'
import Link from 'next/link'
import { DialogMetadata } from '@/app/components/StandardDialogContent'

function generatePrimaryButton(
  label: string,
  buttonText: string,
  url: string,
): React.ReactNode {
  return (
    <Button asChild size="lg">
      <a
        href={url}
        onClick={() => trackOfferEngaged(label)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Text as="span">{buttonText}</Text>
      </a>
    </Button>
  )
}

// Build Section
export const testnetPaymasterMetadata: DialogMetadata = {
  label: 'Testnet Paymaster',
  title:
    'Integrate smart accounts and get your testnet transactions sponsored.',
  description: (
    <Text as="p">
      Testnet Paymaster supports dapps on OP Mainnet, Base, Fraxtal, and Zora.
    </Text>
  ),
  primaryButton: generatePrimaryButton(
    'Testnet Paymaster',
    'View integration',
    externalRoutes.TESTNET_PAYMASTER_GITHUB.path,
  ),
  secondaryButton: (
    <Button asChild variant="secondary" size="lg">
      <a
        href={externalRoutes.LEARN_ABOUT_PAYMASTER.path}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Text as="span">View demo app</Text>
      </a>
    </Button>
  ),
}

export const uxReviewMetadata: DialogMetadata = {
  label: 'UX Review',
  title:
    'Get actionable feedback from Superchain pros to get your app ready for launch',
  description: (
    <Text as="p">
      Technical builders from Superchain teams are standing by to review your
      dapp. Whether you’re building DeFi, DeSo, Infra, or anything else, we’ll
      connect you with people who get it.
    </Text>
  ),

  primaryButton: generatePrimaryButton(
    'UX Review',
    'Apply',
    forms.UX_REVIEW_TESTNET,
  ),
}

export const superchainSafeMetadata: DialogMetadata = {
  label: 'Superchain Safe',
  title: 'Get multisig support on any OP Chain in the Superchain with Safe',
  description: (
    <Text as="p">
      Superchain Safe provides an interface for multsig custody and asset
      management—for dapps across the Superchain.
    </Text>
  ),
}

export const quickStartMetadata: DialogMetadata = {
  label: 'Quick Start',
  title: 'Deploy an app on the Superchain in under 15 minutes.',
  description: (
    <Text as="p">
      Follow this three-step tutorial to deploy your first app to any chain in
      the Superchain
    </Text>
  ),

  primaryButton: generatePrimaryButton(
    'Quick Start',
    'Go to tutorial',
    externalRoutes.QUICK_START.path,
  ),
}

// Launch & Grow Section
export const deploymentRebateMetadata: DialogMetadata = {
  label: 'Deployment Rebate',
  title:
    'Launch on the Superchain and get your deployment costs covered up to $200',
  description: (
    <Text as="p">
      Get your app up and running without having to worry about deployment fees.
    </Text>
  ),
  primaryButton: (
    <Button disabled size="lg">
      <Text as="span">Coming soon</Text>
    </Button>
  ),
}

export const deploymentRebateM2Metadata: DialogMetadata = {
  label: 'Deployment Rebate',
  title:
    'Launch on the Superchain and get your deployment costs covered up to 0.05 ETH',
  description: (
    <>
      <Text as="p">
        Get your app up and running without having to worry about deployment
        fees.
      </Text>
      <Text as="p" className="mt-6">
        Details:
      </Text>
      <ul className="list-disc pl-6 mb-2">
        <li>
          <Text as="p">
            You must have signed up to Dapp Console before launching contracts
          </Text>
        </li>
        <li>
          <Text as="p">Contracts must be added to Dapp Console</Text>
        </li>
        <li>
          <Text as="p">
            Your onchain identity must be verified through Coinbase Verification
          </Text>
        </li>
      </ul>
    </>
  ),
  primaryButton: (
    <Button id="deployment-rebate-add-contracts" size="lg" asChild>
      <Link href={routes.CONTRACTS.path}>
        <Text as="span">Add Contracts</Text>
      </Link>
    </Button>
  ),
  secondaryButton: (
    <Button size="lg" variant="outline" asChild>
      <Link
        href={externalRoutes.TERMS.path}
        replace={true}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Text as="span">See Terms</Text>
      </Link>
    </Button>
  ),
}

export const mainnetPaymasterMetadata: DialogMetadata = {
  label: 'Paymaster',
  title:
    'Get up to $500 in free gas for your users when you use the Superchain Paymaster',
  description: (
    <Text as="p">
      Optimism will sponsor your mainnet transactions to help you attract users
      and grow your product.
    </Text>
  ),
  primaryButton: generatePrimaryButton(
    'Paymaster',
    'Join waitlist',
    forms.MAINNET_PAYMASTER,
  ),
  secondaryButton: (
    <Button asChild variant="secondary" size="lg">
      <a
        href={externalRoutes.LEARN_ABOUT_PAYMASTER.path}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Text as="span">Learn about paymasters</Text>
      </a>
    </Button>
  ),
}

export const megaphoneMetadata: DialogMetadata = {
  label: 'Megaphone',
  title: 'Amplify your launch through Superchain marketing channels',
  description: (
    <Text as="p">
      When you’re ready, Superchain teams will communicate your launch to
      audiences across X, Farcaster, and other marketing channels.
    </Text>
  ),
  primaryButton: generatePrimaryButton('Megaphone', 'Apply', forms.MEGAPHONE),
}

export const userFeedbackMetadata: DialogMetadata = {
  label: 'User Feedback',
  title:
    'Get actionable feedback from Superchain contributors to improve your app',
  description: (
    <Text as="p">
      Passionate contributors from Superchain communities, like Base and
      Optimism, are standing by to provide feedback on any topic.
    </Text>
  ),
  primaryButton: generatePrimaryButton(
    'User Feedback',
    'Apply',
    forms.USER_FEEDBACK_MAINNET,
  ),
}

// Promo Section
export const alchemyGrowthMetadata: DialogMetadata = {
  label: 'Deals',
  title: 'Get 2 months of Alchemy Growth tier for free',
  description: (
    <>
      <Text as="p" className="mb-4">
        Redeem Alchemy’s account abstraction partner benefits for two months of
        free Growth tier ($100 value!). You’ll also get 50% reduced Gas Manager
        Admin fees.
      </Text>
      <Text as="p" className="mb-1">
        Details:
      </Text>
      <ul className="list-disc pl-4">
        <li>You must have an Alchemy account with a credit card on file</li>
        <li>Your app must be ERC-1271 compatible</li>
      </ul>
    </>
  ),
  bannerImage: '/banners/alchemy-banner.png',
  primaryButton: generatePrimaryButton(
    'Alchemy Growth',
    'Apply',
    forms.ALCHEMY_GROWTH,
  ),
  secondaryButton: (
    <Button asChild variant="secondary" size="lg">
      <a
        href={externalRoutes.ALCHEMY_LEARN_MORE.path}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Text as="span">{externalRoutes.ALCHEMY_LEARN_MORE.label}</Text>
      </a>
    </Button>
  ),
}

export const alchemySubgraphMetadata: DialogMetadata = {
  label: 'Deals',
  title: 'Get 3 months of Alchemy Subgraphs for free ',
  description: (
    <Text as="p">
      Migrate to Subgraphs by March 31, 2024 for 3 months free.
    </Text>
  ),
  bannerImage: '/banners/alchemy-banner.png',
  primaryButton: generatePrimaryButton(
    'Alchemy Growth',
    'Apply',
    forms.ALCHEMY_SUBGRAPHS,
  ),
  secondaryButton: (
    <Button asChild variant="secondary" size="lg">
      <a
        href={externalRoutes.ALCHEMY_SUBGRAPHS_LEARN_MORE.path}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Text as="span">
          {externalRoutes.ALCHEMY_SUBGRAPHS_LEARN_MORE.label}
        </Text>
      </a>
    </Button>
  ),
}

export const gelatoMetadata: DialogMetadata = {
  label: 'Deals',
  title: 'Get 30 days of VIP deployment support from Gelato',
  description: (
    <Text as="p">
      To support Superchain builders, Gelato is offering 30-days of VIP
      deployment support to help you integrate Gelato Web3 Services and
      fast-track your development time.
    </Text>
  ),
  bannerImage: '/banners/gelato-banner.png',
  primaryButton: generatePrimaryButton('Gelato', 'Apply', forms.GELATO),
  secondaryButton: (
    <Button asChild variant="secondary" size="lg">
      <a
        href={externalRoutes.GELATO_LEARN_MORE.path}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Text as="span">{externalRoutes.GELATO_LEARN_MORE.label}</Text>
      </a>
    </Button>
  ),
}

export const quicknodeMetadata: DialogMetadata = {
  label: 'Deals',
  title:
    'Get $50/month in credits for up to 3 months when you build on the Superchain',
  description: (
    <Text as="p">
      With the QuickNode credit program, you can experiment with the platform
      without having to worry about cost. You’ll receive $150 of credits over
      the next three months.
    </Text>
  ),
  bannerImage: '/banners/quicknode-banner.png',
  primaryButton: generatePrimaryButton('Quicknode', 'Apply', forms.QUICKNODE),
  secondaryButton: (
    <Button asChild variant="secondary" size="lg">
      <a
        href={externalRoutes.QUICKNODE_LEARN_MORE.path}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Text as="span">{externalRoutes.QUICKNODE_LEARN_MORE.label}</Text>
      </a>
    </Button>
  ),
}

export const thirdWebMetadata: DialogMetadata = {
  label: 'Deals',
  title: 'Get 90 days of Thirdweb’s Growth plan and more for free',
  description: (
    <>
      <Text as="p" className="mb-4">
        Supercharge your dapp’s growth by using Thirdweb’s growth plan along
        with an array of benefits including credits, prioritized support,
        co-marketing opportunities, educational resources, ecosystem
        connections, and more.
      </Text>
      <Text as="p">
        Details: In the following form, write Dev Console when asked “how you
        learned about the program”.
      </Text>
    </>
  ),
  bannerImage: '/banners/thirdweb-banner.png',
  primaryButton: generatePrimaryButton('Third Web', 'Apply', forms.THIRDWEB),
  secondaryButton: (
    <Button asChild variant="secondary" size="lg">
      <a
        href={externalRoutes.THIRDWEB_LEARN_MORE.path}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Text as="span">{externalRoutes.THIRDWEB_LEARN_MORE.label}</Text>
      </a>
    </Button>
  ),
}

export const spearbitMetadata: DialogMetadata = {
  label: 'Deals',
  title: 'Get subsidies for audits and security services from SpearBit',
  description: (
    <>
      <Text as="p" className="mb-4">
        SpearBit and Optimism Grants Council are offering partial or full
        subsidies for audits, running an audit competition, or anything
        security-related. Please note: The Optimism Grants Council are the final
        decision-makers in determining the amount subsidized.
      </Text>
      <Text as="p">
        Details: In the following form, write Dev Console when asked “how you
        learned about the program”.
      </Text>
    </>
  ),
  bannerImage: '/banners/spearbit-banner.png',
  primaryButton: generatePrimaryButton('Spearbit', 'Apply', forms.SPEARBIT),
  secondaryButton: (
    <Button asChild variant="secondary" size="lg">
      <a
        href={externalRoutes.SPEARBIT_LEARN_MORE.path}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Text as="span">{externalRoutes.SPEARBIT_LEARN_MORE.label}</Text>
      </a>
    </Button>
  ),
}
