import { Badge } from '@eth-optimism/ui-components/src/components/ui/badge'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import { usePrivy } from '@privy-io/react-auth'
import { useMemo } from 'react'
import {
  testnetPaymasterMetadata,
  uxReviewMetadata,
  superchainSafeMetadata,
  deploymentRebateMetadata,
  mainnetPaymasterMetadata,
  megaphoneMetadata,
  userFeedbackMetadata,
  gelatoMetadata,
  quicknodeMetadata,
  thirdWebMetadata,
  alchemyGrowthMetadata,
  alchemySubgraphMetadata,
} from '@/app/console/constants'
import Image from 'next/image'
import { DialogClose } from '@eth-optimism/ui-components/src/components/ui/dialog'

export type DialogMetadata = {
  label: string
  title: string
  description: React.ReactNode
  primaryButton: React.ReactNode
  secondaryButton?: React.ReactNode
  bannerImage?: string
}

const useDialogContent = () => {
  const { authenticated, login } = usePrivy()

  const loginButton = (label: string) => {
    return (
      <DialogClose asChild>
        <Button onClick={login}>
          <Text as="span">{label}</Text>
        </Button>
      </DialogClose>
    )
  }

  const testnetPaymasterContent: React.ReactNode = useMemo(() => {
    return renderDialog({
      ...testnetPaymasterMetadata,
    })
  }, [])

  const uxReviewContent: React.ReactNode = useMemo(() => {
    return renderDialog({
      ...uxReviewMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply')
        : uxReviewMetadata.primaryButton,
    })
  }, [authenticated, login])

  const superchainSafeContent = useMemo(() => {
    return renderDialog({
      ...superchainSafeMetadata,
    })
  }, [])

  const deploymentRebateContent = useMemo(() => {
    return renderDialog({
      ...deploymentRebateMetadata,
    })
  }, [authenticated, login])

  const mainnetPaymasterContent = useMemo(() => {
    return renderDialog({
      ...mainnetPaymasterMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to join waitlist')
        : mainnetPaymasterMetadata.primaryButton,
    })
  }, [authenticated, login])

  const megaphoneContent = useMemo(() => {
    return renderDialog({
      ...megaphoneMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply')
        : megaphoneMetadata.primaryButton,
    })
  }, [authenticated, login])

  const userFeedbackContent = useMemo(() => {
    return renderDialog({
      ...userFeedbackMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply')
        : userFeedbackMetadata.primaryButton,
    })
  }, [authenticated, login])

  const gelatoContent = useMemo(() => {
    return renderDialog({
      ...gelatoMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply')
        : gelatoMetadata.primaryButton,
    })
  }, [])

  const alchemyGrowthContent = useMemo(() => {
    return renderDialog({
      ...alchemyGrowthMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply')
        : alchemyGrowthMetadata.primaryButton,
    })
  }, [])

  const alchemySubgraphContent = useMemo(() => {
    return renderDialog({
      ...alchemySubgraphMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply')
        : alchemySubgraphMetadata.primaryButton,
    })
  }, [])

  const quicknodeContent = useMemo(() => {
    return renderDialog({
      ...quicknodeMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply')
        : quicknodeMetadata.primaryButton,
    })
  }, [])

  const thirdWebContent = useMemo(() => {
    return renderDialog({
      ...thirdWebMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply')
        : thirdWebMetadata.primaryButton,
    })
  }, [])

  return {
    testnetPaymasterContent,
    uxReviewContent,
    superchainSafeContent,
    deploymentRebateContent,
    mainnetPaymasterContent,
    megaphoneContent,
    userFeedbackContent,
    gelatoContent,
    alchemyGrowthContent,
    alchemySubgraphContent,
    quicknodeContent,
    thirdWebContent,
  }
}

const renderDialog = (dialogMetadata: DialogMetadata) => {
  return (
    <div>
      <Badge variant="secondary">
        <Text as="p">{dialogMetadata.label}</Text>
      </Badge>
      {dialogMetadata.bannerImage && (
        <Image
          src={dialogMetadata.bannerImage}
          alt={`${dialogMetadata.label} banner`}
          className="w-full rounded-xs mt-6 object-cover"
          width={450}
          height={140}
        />
      )}
      <div className="py-6">
        <Text as="h3" className="text-lg font-semibold mb-2">
          {dialogMetadata.title}
        </Text>
        <div className="text-sm text-muted-foreground">
          {dialogMetadata.description}
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {dialogMetadata.primaryButton}
        {dialogMetadata.secondaryButton}
      </div>
    </div>
  )
}

export { useDialogContent }
