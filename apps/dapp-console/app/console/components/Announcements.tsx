'use client'

import { DeploymentRebateBanner } from '@/app/components/Banner/DeploymentRebateBanner'
import { useFeature } from '@/app/hooks/useFeatureFlag'

export const Announcements = () => {
  const isSettingsEnabled = useFeature('enable_console_settings')

  return isSettingsEnabled ? (
    <div className="flex flex-col w-full mt-4 md:mt-10 lg:mt-16">
      <DeploymentRebateBanner />
    </div>
  ) : null
}
