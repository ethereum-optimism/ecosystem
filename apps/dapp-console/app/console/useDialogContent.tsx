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
import { trackSignInModalClick } from '@/app/event-tracking/mixpanel'

const useDialogContent = () => {
  const { authenticated, login } = usePrivy()
  const isSettingsEnabled = useFeature('enable_console_settings')

  const loginButton = (label: string, trackingLabel: string) => {
    return (
      <DialogClose asChild>
        <Button
          onClick={() => {
            login()
            trackSignInModalClick(trackingLabel)
          }}
        >
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
        ? loginButton('Sign in to apply', uxReviewMetadata.label)
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
        ? loginButton(
            'Sign in to join waitlist',
            mainnetPaymasterMetadata.label,
          )
        : mainnetPaymasterMetadata.primaryButton,
    })
  }, [authenticated, login])

  const megaphoneContent = useMemo(() => {
    return renderDialog({
      ...megaphoneMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply', megaphoneMetadata.label)
        : megaphoneMetadata.primaryButton,
    })
  }, [authenticated, login])

  const userFeedbackContent = useMemo(() => {
    return renderDialog({
      ...userFeedbackMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply', userFeedbackMetadata.label)
        : userFeedbackMetadata.primaryButton,
    })
  }, [authenticated, login])

  const gelatoContent = useMemo(() => {
    return renderDialog({
      ...gelatoMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply', gelatoMetadata.label)
        : gelatoMetadata.primaryButton,
      secondaryButton: !authenticated ? null : gelatoMetadata.secondaryButton,
    })
  }, [authenticated, login])

  const alchemyGrowthContent = useMemo(() => {
    return renderDialog({
      ...alchemyGrowthMetadata,
      primaryButton: !authenticated
        ? loginButton('Sign in to apply', alchemyGrowthMetadata.label)
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
        ? loginButton('Sign in to apply', alchemySubgraphMetadata.label)
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
        ? loginButton('Sign in to apply', quicknodeMetadata.label)
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
        ? loginButton('Sign in to apply', thirdWebMetadata.label)
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
