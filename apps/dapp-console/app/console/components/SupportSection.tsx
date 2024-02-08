'use client'

import { Tile } from '@/app/components/Tile/Tile'
import { FarcasterIcon } from '@/app/icons/FarcasterIcon'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import { RiDiscordFill, RiGitForkFill, RiGithubFill } from '@remixicon/react'

const SupportSection = () => {
  return (
    <div>
      <Text as="h3" className="text-2xl font-semibold mb-4">
        Support
      </Text>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Tile
          title="Github Developer Forum"
          description="Get all of your development questions answered by Superchain experts."
          onClick={() => {}}
          variant="secondary"
          icon={<RiGithubFill size={24} />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[125px]">
          <Tile
            title="Farcaster"
            description="Join the /op-stack channel."
            onClick={() => {}}
            variant="secondary"
            icon={<FarcasterIcon size={24} />}
          />
          <Tile
            title="Dapp examples"
            onClick={() => {}}
            variant="secondary"
            icon={<RiGitForkFill size={24} />}
          />
          <Tile
            title="Discord"
            onClick={() => {}}
            variant="secondary"
            icon={<RiDiscordFill size={24} />}
          />
          <Tile
            title="Docs"
            onClick={() => {}}
            variant="secondary"
            icon={<RiGitForkFill size={24} />}
          />
        </div>
      </div>
    </div>
  )
}

export { SupportSection }
