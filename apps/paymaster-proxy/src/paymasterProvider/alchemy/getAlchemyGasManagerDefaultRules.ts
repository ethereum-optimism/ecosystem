import { getCurrentUnixTimestamp } from '@/utils/getCurrentUnixTimestamp'

const NON_DURATION_RULES = {
  maxSpendUsd: 10.0,
  maxSpendPerSenderUsd: 1.0,
  maxSpendPerUoUsd: 1.0,
  maxCount: 1000,
  maxCountPerSender: 100,
  senderAllowlist: null,
  senderBlocklist: null,
  sponsorshipExpiryMs: '300000', // 5 minutes
} as const

const DEFAULT_DURATION = 60 * 60 * 24 * 30 // 30 days

export const getAlchemyGasManagerDefaultRules = () => {
  const currentUnixTimestamp = getCurrentUnixTimestamp()

  return {
    ...NON_DURATION_RULES,
    startTimeUnix: currentUnixTimestamp.toString(),
    endTimeUnix: (currentUnixTimestamp + DEFAULT_DURATION).toString(),
  }
}
