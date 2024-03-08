'use client'

import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react'

import { featureFlagsFetcherAndParser } from '@/app/helpers/featureFlags'
import { ENV_VARS } from '@/app/constants/envVars'
import { useEffect, useMemo } from 'react'

export const FeatureFlagProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const growthbook = useMemo(() => new GrowthBook(), [])

  useEffect(() => {
    if (!ENV_VARS.GROWTHBOOK_ENDPOINT) {
      // TODO: send error to sentry when we add support
      return
    }

    ;(async () => {
      const features = await featureFlagsFetcherAndParser(
        ENV_VARS.GROWTHBOOK_ENDPOINT,
        {
          decrypt: ENV_VARS.GROWTHBOOK_ENCRYPTION_KEY,
        },
      )

      if (features) {
        console.log(features)
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        growthbook.setFeatures(features as Record<string, any>)
      }
    })()
  }, [growthbook])

  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  )
}
