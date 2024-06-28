import React, { useEffect, useMemo } from 'react'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import {
  useRive,
  UseRiveParameters,
  Layout,
  Fit,
  Alignment,
  useStateMachineInput,
} from '@rive-app/react-canvas'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import {
  RiCheckboxCircleFill,
  RiExternalLinkFill,
  RiLoader4Fill,
} from '@remixicon/react'

type Props = {
  claimAmount: number | null
  claimNetwork: string | null
  isClaimSuccessful: boolean
  isClaimInProgress: boolean
  closeDialog: () => void
  blockExplorerUrl: string
}

const SuccessDialog: React.FC<Props> = ({
  claimAmount,
  claimNetwork,
  isClaimSuccessful,
  isClaimInProgress,
  closeDialog,
  blockExplorerUrl,
}) => {
  const isOffchainClaim = claimAmount === 0.05
  const riveParams = useMemo(
    () => ({
      src: '/sunny-animation.riv',
      stateMachines: ['State Machine 1'],
      autoplay: true,
      layout: new Layout({
        fit: Fit.Cover,
        alignment: Alignment.Center,
      }),
    }),
    [],
  )

  const { RiveComponent, rive } = useRive(riveParams as UseRiveParameters)
  const celebrateInput = useStateMachineInput(
    rive,
    'State Machine 1',
    'celebrate',
  )

  useEffect(() => {
    if (isClaimSuccessful && celebrateInput && !celebrateInput.value) {
      celebrateInput.value = true
      const timer = setTimeout(() => {
        console.log('got here')
        celebrateInput.value = false
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isClaimSuccessful])

  useEffect(() => {
    return () => {
      if (rive) {
        rive.cleanup()
      }
    }
  }, [rive])

  let title
  if (isClaimSuccessful) {
    title = `Claimed ${claimAmount} ETH on ${claimNetwork}`
  } else if (isClaimInProgress || isOffchainClaim) {
    title = 'Claiming testnet funds'
  } else {
    title = 'Please sign the transaction in your wallet'
  }

  let description
  if (isClaimSuccessful) {
    description =
      'Please allow a few minutes for the testnet funds to arrive in your wallet'
  } else if (isClaimInProgress || isOffchainClaim) {
    description = 'Waiting for network confirmation'
  } else {
    description = 'Please sign the transaction in your wallet'
  }

  const loadingButton = (
    <Button className="w-full" disabled>
      <RiLoader4Fill className="animate-spin" size={20} />
    </Button>
  )

  const viewTransactionButton = (
    <Button className="w-full" asChild>
      <a href={blockExplorerUrl} target="_blank">
        View transaction
        <RiExternalLinkFill className="ml-2" size={14} />
      </a>
    </Button>
  )

  return (
    <>
      <div className="flex flex-col items-center w-full rounded-md overflow-hidden">
        <RiveComponent className="h-96 w-full" />

        <div className="flex items-center gap-2 mb-1">
          {isClaimSuccessful && (
            <RiCheckboxCircleFill size={18} color="#5BA85A" />
          )}
          <Text as="h2" className="text-lg font-semibold">
            {title}
          </Text>
        </div>

        <div className="mb-6">
          <Text as="p" className="text-secondary-foreground text-center">
            {description}
          </Text>
        </div>

        <div className="flex flex-col-reverse gap-2 w-full sm:flex-row">
          <Button variant="secondary" className="w-full" onClick={closeDialog}>
            Close
          </Button>
          {isClaimSuccessful ? viewTransactionButton : loadingButton}
        </div>
      </div>
    </>
  )
}

export { SuccessDialog }
