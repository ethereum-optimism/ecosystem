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
  moralisMetadata,
  thirdWebMetadata,
} from '@/app/console/constants'
import Image from 'next/image'
import { DialogClose } from '@eth-optimism/ui-components/src/components/ui/dialog'

export type DialogMetadata = {
  label: string
  title: string
  description: string
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
      primaryButton: !authenticated
        ? loginButton('Sign in to apply')
        : deploymentRebateMetadata.primaryButton,
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
    })
  }, [])

  const quicknodeContent = useMemo(() => {
    return renderDialog({
      ...quicknodeMetadata,
    })
  }, [])

  const moralisContent = useMemo(() => {
    return renderDialog({
      ...moralisMetadata,
    })
  }, [])

  const thirdWebContent = useMemo(() => {
    return renderDialog({
      ...thirdWebMetadata,
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
    quicknodeContent,
    moralisContent,
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
        <Text as="p" className="text-sm text-muted-foreground">
          {dialogMetadata.description}
        </Text>
      </div>
      <div className="flex flex-col gap-2.5">
        {dialogMetadata.primaryButton}
        {dialogMetadata.secondaryButton}
      </div>
    </div>
  )
}

export { useDialogContent }
