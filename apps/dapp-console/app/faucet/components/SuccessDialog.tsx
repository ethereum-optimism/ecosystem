import React, { useEffect } from 'react'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import {
  useRive,
  UseRiveParameters,
  Layout,
  Fit,
  Alignment,
} from '@rive-app/react-canvas'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'

const SuccessDialog: React.FC = () => {
  const { RiveComponent } = useRive({
    src: '/sunny-animation.riv',
    stateMachines: ['State Machine 1'],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  } as UseRiveParameters)

  return (
    <div className="flex flex-col items-center w-full rounded-md overflow-hidden">
      <Text as="h2" className="text-xl font-semibold">
        Waiting for confirmation
      </Text>
      <Text as="p" className="">
        Please sign the transaction in your wallet
      </Text>
      <RiveComponent className="h-96 w-full" />
      <Button variant="secondary" className="w-full">
        Close
      </Button>
    </div>
  )
}

export { SuccessDialog }
