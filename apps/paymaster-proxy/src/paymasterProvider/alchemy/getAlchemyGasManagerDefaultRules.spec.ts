import { describe, expect, it } from 'vitest'

import { getAlchemyGasManagerDefaultRules } from '@/paymasterProvider/alchemy/getAlchemyGasManagerDefaultRules'
import { getCurrentUnixTimestamp } from '@/utils/getCurrentUnixTimestamp'

describe(getAlchemyGasManagerDefaultRules.name, async () => {
  it('applies 1 month duration from create time', () => {
    const rules = getAlchemyGasManagerDefaultRules()

    expect(Number(rules.endTimeUnix) - Number(rules.startTimeUnix)).toBe(
      30 * 24 * 60 * 60,
    )
  })
  it('start time around current time', () => {
    const rules = getAlchemyGasManagerDefaultRules()

    expect(Number(rules.startTimeUnix)).toBeCloseTo(getCurrentUnixTimestamp())
  })
})
