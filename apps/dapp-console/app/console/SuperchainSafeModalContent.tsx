import { useState } from 'react'
import { renderDialog } from '@/app/console/useDialogContent'
import { superchainSafeMetadata } from '@/app/console/constants'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import { DialogHeader } from '@eth-optimism/ui-components/src/components/ui/dialog'
import Image from 'next/image'
import { superchainSafeNetworks } from '@/app/constants'

const renderChainButton = (item: any) => {
  return (
    <>
      <Image
        src={item.logo}
        alt={`${item.label} logo`}
        width={40}
        height={40}
        className="rounded-full"
      />
      <Text as="span" className="text-base">
        {item.label}
      </Text>
    </>
  )
}

const SuperchainSafeModalContent = () => {
  const [currentModalStep, setCurrentModalStep] = useState<0 | 1>(0)

  const initialStepContent = renderDialog({
    ...superchainSafeMetadata,
    primaryButton: (
      <Button
        onClick={() => {
          setCurrentModalStep(1)
        }}
        size="lg"
        className="w-full"
      >
        <Text as="span">Get Superchain Safe</Text>
      </Button>
    ),
  })

  const secondaryStepContent = (
    <div>
      <DialogHeader>
        <Text as="span" className="text-lg font-semibold pb-6">
          Choose a network
        </Text>
      </DialogHeader>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {superchainSafeNetworks.map((item) => (
          <Button
            asChild
            key={item.path}
            variant="secondary"
            className="justify-start py-8"
          >
            {!item.path ? (
              <div className="flex items-center gap-4">
                {renderChainButton(item)}
              </div>
            ) : (
              <a
                href={item.path}
                target="_blank"
                className="flex items-center gap-4"
                rel="noreferrer noopener"
              >
                {renderChainButton(item)}
              </a>
            )}
          </Button>
        ))}
      </div>
    </div>
  )

  return (
    <div>
      {currentModalStep === 0 && initialStepContent}
      {currentModalStep === 1 && secondaryStepContent}
    </div>
  )
}

export { SuperchainSafeModalContent }
