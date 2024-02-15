'use client'

import { Tile, TileGrid } from '@/app/components/Tile/Tile'
import { externalRoutes } from '@/app/constants'
import { Badge } from '@eth-optimism/ui-components/src/components/ui/badge'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@eth-optimism/ui-components/src/components/ui/dialog'
import { useState } from 'react'
import { useDialogContent } from '@/app/console/useDialogContent'

const BuildSection = () => {
  const [dialogContent, setDialogContent] = useState<React.ReactNode>()
  const { testnetPaymasterContent, uxReviewContent, superchainSafeContent } =
    useDialogContent()

  return (
    <div>
      <Text as="h3" className="text-2xl font-semibold mb-4">
        Build
      </Text>
      <Dialog>
        <TileGrid>
          <Tile
            title="Superchain Faucet"
            description="Get test ETH tokens to build your dapp on the Superchain."
            onClick={() => {
              window.open(
                externalRoutes.SUPERCHAIN_FAUCET.path,
                '_blank',
                'noopener noreferrer',
              )
            }}
          />
          <DialogTrigger asChild>
            <Tile
              title="Testnet Paymaster"
              description="Get your testnet transactions sponsored to remove friction from your dapp experience."
              onClick={() => {
                setDialogContent(testnetPaymasterContent)
              }}
            />
          </DialogTrigger>
          <DialogTrigger asChild>
            <Tile
              title="UX Review"
              description="Get actionable feedback from Superchain pros to get your dapp ready for launch."
              onClick={() => {
                setDialogContent(uxReviewContent)
              }}
              badge={<Badge>Featured</Badge>}
            />
          </DialogTrigger>
          <DialogTrigger asChild>
            <Tile
              title="Superchain Safe"
              description="Get multisig support on any OP Chain in the Superchain."
              onClick={() => {
                setDialogContent(superchainSafeContent)
              }}
            />
          </DialogTrigger>
        </TileGrid>
        <DialogContent className="w-[448px]">{dialogContent}</DialogContent>
      </Dialog>
    </div>
  )
}

export { BuildSection }
