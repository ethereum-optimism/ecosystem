'use client'

import { Tile, TileGrid } from '@/app/components/Tile/Tile'
import { Badge } from '@eth-optimism/ui-components/src/components/ui/badge'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'

const LaunchSection = () => {
  return (
    <div>
      <Text as="h3" className="text-2xl font-semibold mb-4">
        Launch & Grow
      </Text>
      <TileGrid>
        <Tile
          title="Deployment Rebate"
          description="Launch on the Superchain and get your deployment costs covered up to $200."
          onClick={() => {}}
          badge={<Badge>Featured</Badge>}
        />
        <Tile
          title="Paymaster"
          description="Get up to $500 in free gas for your users when you use the Superchain Paymaster."
          onClick={() => {}}
          badge={<Badge variant="secondary">Join waitlist</Badge>}
        />
        <Tile
          title="Megaphone"
          description="Amplify your launch through Superchain marketing channels."
          onClick={() => {}}
        />
        <Tile
          title="User Feedback"
          description="Get actionable feedback from Superchain contributors to improve your app."
          onClick={() => {}}
        />
        <Tile
          title="RetroPGF"
          description="Get funded for adding value to the Superchain ecosystem."
          onClick={() => {}}
        />
      </TileGrid>
    </div>
  )
}

export { LaunchSection }
