import crypto from 'crypto'

import { getRandomAddress } from '@/testUtils/getRandomAddress'

export const mockAlchemyGasManagerPolicy = {
  policyId: crypto.randomUUID(),
  appId: 'dkdskdsaflk12k1l',
  status: 'active',
  rules: {
    maxSpendUsd: 5000,
    maxSpendPerSenderUsd: 100,
    maxCount: 100,
    maxCountPerSender: 2,
    senderAllowlist: [getRandomAddress(), getRandomAddress()],
    senderBlocklist: null,
    startTimeUnix: '1600000000',
    endTimeUnix: '1650000000',
    maxSpendPerUoUsd: 20,
    sponsorshipExpiryMs: '600000',
  },
  policyName: 'fake-policy',
  lastUpdatedUnix: '1700000000',
  policyVersion: 0,
  policyType: 'sponsorship',
  policyState: 'ongoing',
  network: 'OPT_SEPOLIA',
}
