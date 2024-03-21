import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { usePrivy } from '@privy-io/react-auth'
import { useMemo } from 'react'
import {
  testnetPaymasterMetadata,
  uxReviewMetadata,
  deploymentRebateMetadata,
  deploymentRebateM2Metadata,
  mainnetPaymasterMetadata,
  megaphoneMetadata,
  userFeedbackMetadata,
  gelatoMetadata,
  quicknodeMetadata,
  thirdWebMetadata,
  alchemyGrowthMetadata,
  alchemySubgraphMetadata,
  quickStartMetadata,
} from '@/app/console/constants'
import { DialogClose } from '@eth-optimism/ui-components/src/components/ui/dialog/dialog'
import { useFeature } from '@/app/hooks/useFeatureFlag'
import {
  DialogMetadata,
  StandardDialogContent,
} from '@/app/components/StandardDialogContent'

const useDialogContent = () => {
  const { authenticated, login } = usePrivy()
  const isSettingsEnabled = useFeature('enable_console_settings')

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

  const quickStartContent: React.ReactNode = useMemo(() => {
    return renderDialog({
      ...quickStartMetadata,
    })
  }, [authenticated, login])

  const deploymentRebateContent = useMemo(() => {
    return renderDialog({
      ...(isSettingsEnabled
        ? deploymentRebateM2Metadata
        : deploymentRebateMetadata),
    })
  }, [authenticated, login, isSettingsEnabled])

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
      secondaryButton: !authenticated ? null : gelatoMetadata.secondaryButton,
    })
  }, [authenticated, login])

  const alchemyGrowthContent = useMemo(() => {
    return renderDialog({
      ...alchemyGrowthMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply')
        : alchemyGrowthMetadata.primaryButton,
      secondaryButton: !authenticated
        ? null
        : alchemyGrowthMetadata.secondaryButton,
    })
  }, [authenticated, login])

  const alchemySubgraphContent = useMemo(() => {
    return renderDialog({
      ...alchemySubgraphMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply')
        : alchemySubgraphMetadata.primaryButton,
      secondaryButton: !authenticated
        ? null
        : alchemySubgraphMetadata.secondaryButton,
    })
  }, [authenticated, login])

  const quicknodeContent = useMemo(() => {
    return renderDialog({
      ...quicknodeMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply')
        : quicknodeMetadata.primaryButton,
      secondaryButton: !authenticated
        ? null
        : quicknodeMetadata.secondaryButton,
    })
  }, [authenticated, login])

  const thirdWebContent = useMemo(() => {
    return renderDialog({
      ...thirdWebMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply')
        : thirdWebMetadata.primaryButton,
      secondaryButton: !authenticated ? null : thirdWebMetadata.secondaryButton,
    })
  }, [authenticated, login])

  return {
    testnetPaymasterContent,
    uxReviewContent,
    deploymentRebateContent,
    quickStartContent,
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

export const renderDialog = (dialogMetadata: DialogMetadata) => (
  <StandardDialogContent dialogMetadata={dialogMetadata} />
)

export { useDialogContent }
