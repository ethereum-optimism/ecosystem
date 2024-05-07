import { routes } from '@/app/constants'
import { Text } from '@eth-optimism/ui-components'
import { RiStarFill } from '@remixicon/react'
import Link from 'next/link'

export const DeploymentRebateBanner = () => (
  <div className="flex flex-row w-full min-h-[60px] items-center bg-blue-500/20 rounded-lg px-4 text-blue-600/80 cursor-pointer">
    <Link className="flex flex-row w-full" href={routes.CONTRACTS.path}>
      <RiStarFill />
      <Text as="p" className="ml-2 font-semibold cursor-pointer">
        New: Launch anywhere on the Superchain for free
      </Text>
    </Link>
  </div>
)
