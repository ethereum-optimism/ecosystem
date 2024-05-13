'use client'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'

import { ClaimedRebateProgressBanner } from '@/app/settings/components/ClaimedRebateProgressBanner'
import { CoinbaseVerificationBanner } from '@/app/settings/components/CoinbaseVerificationBanner'
import { DeployedApps } from '@/app/settings/contracts/DeployedApps'
import { ClaimedRebates } from '@/app/settings/components/ClaimedRebates'
import { apiClient } from '@/app/helpers/apiClient'
import { useEffect } from 'react'
import { useFeatureFlag } from '@/app/hooks/useFeatureFlag'

export default function Contracts() {
  const isDeploymentRebateEnabled = useFeatureFlag('enable_deployment_rebate')

  const { mutate: syncCbVerification } =
    apiClient.wallets.syncCbVerification.useMutation()

  const { data: walletVerifications, isLoading: isLoadingCbVerifiedWallets } =
    apiClient.wallets.walletVerifications.useQuery()

  useEffect(() => {
    syncCbVerification()
  }, [syncCbVerification])

  return (
    <div className="flex flex-col gap-2">
      <Text className="text-lg font-semibold">Your apps</Text>

      <div className="flex flex-col gap-6">
        <DeployedApps />
      </div>

      {isDeploymentRebateEnabled && (
        <>
          <Text className="text-lg font-semibold">Your rebates</Text>
          <div className="flex flex-col gap-4">
            {!isLoadingCbVerifiedWallets &&
              !walletVerifications?.cbVerifiedWallets.length && (
                <CoinbaseVerificationBanner />
              )}
            <ClaimedRebateProgressBanner />
            <ClaimedRebates />
          </div>
        </>
      )}
    </div>
  )
}
