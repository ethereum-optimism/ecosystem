'use client'

import { Tile, TileGrid } from '@/app/components/Tile/Tile'
import { externalRoutes } from '@/app/constants'
import { Badge } from '@eth-optimism/ui-components/src/components/ui/badge/badge'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@eth-optimism/ui-components/src/components/ui/dialog/dialog'
import { useState } from 'react'
import { useDialogContent } from '@/app/console/useDialogContent'
import { openWindow } from '@/app/helpers'
import { trackCardClick } from '@/app/event-tracking/mixpanel'
import { SuperchainSafeModalContent } from '@/app/console/SuperchainSafeModalContent'

const BuildSection = () => {
  const [dialogContent, setDialogContent] = useState<React.ReactNode>()
  const { testnetPaymasterContent, uxReviewContent, quickStartContent } =
    useDialogContent()
  const superchainSafeContent = <SuperchainSafeModalContent />

  return (
    <div>
      <Text as="h3" className="text-2xl font-semibold mb-4">
        Build
      </Text>
      <Dialog>
        <TileGrid>
          <Tile
            title="Superchain Faucet"
            description="Get test ETH tokens to build your app on the Superchain."
            onClick={() => {
              trackCardClick('Superchain Faucet')
              openWindow(externalRoutes.SUPERCHAIN_FAUCET.path)
            }}
          />
          <DialogTrigger asChild>
            <Tile
              title="Testnet Paymaster"
              description="Integrate smart accounts and get your testnet transactions sponsored."
              onClick={() => {
                trackCardClick('Testnet Paymaster')
                setDialogContent(testnetPaymasterContent)
              }}
            />
          </DialogTrigger>
          <DialogTrigger asChild>
            <Tile
              title="Superchain Safe"
              description="Get multisig support on any OP Chain in the Superchain."
              onClick={() => {
                trackCardClick('Superchain Safe')
                setDialogContent(superchainSafeContent)
              }}
            />
          </DialogTrigger>

          <DialogTrigger asChild>
            <Tile
              title="Quick Start"
              description="Deploy an app on the Superchain in under 15 minutes."
              onClick={() => {
                trackCardClick('Quick start')
                setDialogContent(quickStartContent)
              }}
            />
          </DialogTrigger>
        </TileGrid>
        <DialogContent className="w-full max-w-[448px]">
          {dialogContent}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { BuildSection }
