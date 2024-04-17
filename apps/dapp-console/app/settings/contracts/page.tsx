'use client'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'

import { ClaimedRebateProgressBanner } from '@/app/settings/components/ClaimedRebateProgressBanner'
import { CoinbaseVerificationBanner } from '@/app/settings/components/CoinbaseVerificationBanner'
import { DeployedApps } from '@/app/settings/contracts/DeployedApps'
import { ClaimedRebates } from '@/app/settings/components/ClaimedRebates'

export default function Contracts() {
  return (
    <div className="flex flex-col gap-2">
      <Text className="text-lg font-semibold">Your Apps</Text>

      <div className="flex flex-col gap-6">
        <DeployedApps />
      </div>

      <Text className="text-lg font-semibold">Your Rebates</Text>
      <div className="flex flex-col gap-4">
        <CoinbaseVerificationBanner />
        <ClaimedRebateProgressBanner />
        <ClaimedRebates />
      </div>
    </div>
  )
}
