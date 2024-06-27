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
import { RiCheckboxCircleFill, RiExternalLinkFill } from '@remixicon/react'

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
    if (isClaimSuccessful && celebrateInput) {
      celebrateInput.value = true
      const timer = setTimeout(() => {
        celebrateInput.value = false
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isClaimSuccessful, celebrateInput, closeDialog])

  useEffect(() => {
    return () => {
      if (rive) {
        rive.cleanup()
      }
    }
  }, [rive])

  const title = isClaimSuccessful
    ? 'Claim successful'
    : isOffchainClaim
      ? 'Claiming testnet funds'
      : 'Waiting for confirmation'

  const description = isClaimSuccessful
    ? `You claimed ${claimAmount} ETH on ${claimNetwork}`
    : isOffchainClaim
      ? 'Waiting for network confirmation'
      : 'Please sign the transaction in your wallet'

  return (
    <>
      <div className="flex flex-col items-center w-full rounded-md overflow-hidden">
        <RiveComponent className="h-96 w-full" />

        {isClaimInProgress && <div>In progress...</div>}

        <div className="flex items-center gap-2 mb-1">
          {isClaimSuccessful && (
            <RiCheckboxCircleFill size={18} color="#5BA85A" />
          )}
          <Text as="h2" className="text-lg font-semibold">
            {title}
          </Text>
        </div>

        <Text as="p" className="text-secondary-foreground text-center mb-6">
          {description}
        </Text>
        <div className="flex flex-col-reverse gap-2 w-full sm:flex-row">
          <Button variant="secondary" className="w-full" onClick={closeDialog}>
            Close
          </Button>
          {isClaimSuccessful && (
            <Button className="w-full" asChild>
              <a href={blockExplorerUrl} target="_blank">
                View transaction
                <RiExternalLinkFill className="ml-2" size={14} />
              </a>
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export { SuccessDialog }
