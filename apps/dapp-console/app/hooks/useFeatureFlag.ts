import type { JSONValue } from '@growthbook/growthbook-react'
import { useFeature as useGrowthbookFeature } from '@growthbook/growthbook-react'
import { useEffect } from 'react'
import { z } from 'zod'

const flag = {
  bool: z.boolean().catch(false),
}

const flags = {
  enable_console_settings: flag.bool,
}

export type FeatureFlag = keyof typeof flags

export const useFeature = <
  T extends FeatureFlag,
  V extends JSONValue = z.infer<(typeof flags)[T]>,
>(
  feature: T,
) => {
  const { value } = useGrowthbookFeature<V>(feature)
  const parsedValue = flags[feature].parse(value) as V
  const isValueValid = [null, parsedValue].includes(value)

  useEffect(() => {
    if (!isValueValid) {
      // TODO: capture this and send to sentry
    }
  }, [isValueValid])

  return parsedValue
}
