'use client'

import { Tile, TileGrid } from '@/app/components/Tile/Tile'
import { Badge } from '@eth-optimism/ui-components/src/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@eth-optimism/ui-components/src/components/ui/dialog'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import { useState } from 'react'
import { useDialogContent } from '@/app/console/useDialogContent'
import { externalRoutes } from '@/app/constants'
import { openWindow } from '@/app/helpers'
import { trackCardClick } from '@/app/event-tracking/mixpanel'

const LaunchSection = () => {
  const [dialogContent, setDialogContent] = useState<React.ReactNode>()
  const {
    deploymentRebateContent,
    mainnetPaymasterContent,
    megaphoneContent,
    userFeedbackContent,
  } = useDialogContent()
  return (
    <div>
      <Text as="h3" className="text-2xl font-semibold mb-4">
        Launch & Grow
      </Text>
      <Dialog>
        <TileGrid>
          <DialogTrigger asChild>
            <Tile
              title="Deployment Rebate"
              description="Launch on the Superchain and get your deployment costs covered up to $200."
              onClick={() => {
                trackCardClick('Deployment Rebate')
                setDialogContent(deploymentRebateContent)
              }}
              badge={<Badge>Featured</Badge>}
            />
          </DialogTrigger>
          <DialogTrigger asChild>
            <Tile
              title="Paymaster"
              description="Get up to $500 in free gas for your users when you use the Superchain Paymaster."
              onClick={() => {
                trackCardClick('Paymaster')
                setDialogContent(mainnetPaymasterContent)
              }}
              badge={<Badge variant="secondary">Join waitlist</Badge>}
            />
          </DialogTrigger>
          <DialogTrigger asChild>
            <Tile
              title="Megaphone"
              description="Amplify your launch through Superchain marketing channels."
              onClick={() => {
                trackCardClick('Megaphone')
                setDialogContent(megaphoneContent)
              }}
            />
          </DialogTrigger>
          <DialogTrigger asChild>
            <Tile
              title="User Feedback"
              description="Get actionable feedback from Superchain contributors to improve your app."
              onClick={() => {
                trackCardClick('User Feedback')
                setDialogContent(userFeedbackContent)
              }}
            />
          </DialogTrigger>
          <Tile
            title="RetroPGF"
            description="Get funded for adding value to the Superchain ecosystem."
            onClick={() => {
              trackCardClick('RetroPGF')
              openWindow(externalRoutes.RETRO_PGF.path)
            }}
          />
        </TileGrid>
        <DialogContent className="w-[448px]">{dialogContent}</DialogContent>
      </Dialog>
    </div>
  )
}

export { LaunchSection }
