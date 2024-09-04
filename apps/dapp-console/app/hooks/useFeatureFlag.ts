import type { JSONValue } from '@growthbook/growthbook-react'
import { useFeature as useGrowthbookFeature } from '@growthbook/growthbook-react'
import { useEffect } from 'react'
import { z } from 'zod'
import { captureError } from '@/app/helpers/errorReporting'
import { usePrivy } from '@privy-io/react-auth'

const flag = {
  bool: z.boolean().catch(false),
  string: z.string().catch(''),
}

const flags = {
  enable_console_settings: flag.bool,
  dev_domain: flag.string,
  enable_deployment_rebate: flag.bool,
  enable_console_faucet: flag.bool,
  enable_new_brand: flag.bool,
  enable_github_auth: flag.bool,
}

export type FeatureFlag = keyof typeof flags

export type UseFeatureFlagOptions = {
  allowDevs?: boolean
}

export const useFeatureFlag = <
  T extends FeatureFlag,
  V extends JSONValue = z.infer<(typeof flags)[T]>,
>(
  feature: T,
  options: UseFeatureFlagOptions = {},
) => {
  const { user } = usePrivy()
  const { value } = useGrowthbookFeature<V>(feature)
  const { value: devDomain } = useGrowthbookFeature<string>('dev_domain')
  const parsedValue = flags[feature].parse(value) as V
  const isValueValid = [null, parsedValue].includes(value)

  useEffect(() => {
    if (!isValueValid) {
      captureError(
        new Error(`${feature} value is invalid`),
        'invalidFeatureFlag',
      )
    }
  }, [isValueValid])

  const isBool = typeof parsedValue === 'boolean'
  if (isBool && !parsedValue && options.allowDevs && user) {
    const emailParts = user.email?.address.split('@')
    return emailParts?.pop() === devDomain
  }

  return parsedValue
}
