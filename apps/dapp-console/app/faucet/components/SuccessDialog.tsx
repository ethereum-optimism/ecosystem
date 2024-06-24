import React, { useEffect } from 'react'
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

type Props = {
  claimAmount: number | null
  claimNetwork: string | null
  isClaimSuccessful: boolean
  closeDialog: () => void
}

const SuccessDialog: React.FC<Props> = ({
  claimAmount,
  claimNetwork,
  isClaimSuccessful,
  closeDialog,
}) => {
  const { RiveComponent, rive } = useRive({
    src: '/sunny-animation.riv',
    stateMachines: ['State Machine 1'],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  } as UseRiveParameters)

  const celebrateInput = useStateMachineInput(
    rive,
    'State Machine 1',
    'celebrate',
  )

  useEffect(() => {
    if (isClaimSuccessful && celebrateInput) {
      celebrateInput.value = true
      setTimeout(() => {
        celebrateInput.value = false
      }, 4000)
    }
  }, [isClaimSuccessful, celebrateInput, closeDialog])

  const title = isClaimSuccessful
    ? 'Claim successful'
    : 'Waiting for confirmation'
  const description = isClaimSuccessful
    ? `You have successfully claimed ${claimAmount} test ETH on ${claimNetwork}`
    : 'Please sign the transaction in your wallet'

  return (
    <>
      <div className="flex flex-col items-center w-full rounded-md overflow-hidden">
        <RiveComponent className="h-96 w-full" />
        <Text as="h2" className="text-lg font-semibold">
          {title}
        </Text>
        <Text as="p" className="text-secondary-foreground text-center mb-10">
          {description}
        </Text>
        <Button variant="secondary" className="w-full" onClick={closeDialog}>
          Close
        </Button>
      </div>
    </>
  )
}

export { SuccessDialog }
