import type { TransactionReceipt } from 'viem'

import type { SupportedL2Chains } from '@/constants/supportedChains'
import type { Env } from '@/env'
import { blockStore } from '@/kvModel/block'
import { DepositStatusScreen } from '@/screens/DepositStatusScreen'
import { getRemainingSeconds } from '@/util/getRemainingSeconds'

const LoadingAnimationBaseRoute =
  'https://imagedelivery.net/2vgv0PX0bK5wmgjKfeGfRQ/bridge-frame-loading-animation'

const getLoadingAnimationUrl = (s: number) => {
  return `${LoadingAnimationBaseRoute}/${s}/framesquare`
}

export const getLoadingStatusScreen = async (
  env: Env,
  {
    chain,
    l1TransactionReceipt,
  }: {
    chain: SupportedL2Chains[number]
    l1TransactionReceipt: TransactionReceipt | null
  },
) => {
  if (!l1TransactionReceipt) {
    return (
      <DepositStatusScreen
        primaryText="Starting deposit"
        secondaryText="Confirming on Mainnet..."
      />
    )
  }

  const l1TransactionBlock = await blockStore.fetch(env, {
    chainId: chain.sourceId,
    blockNumber: l1TransactionReceipt.blockNumber,
  })

  if (!l1TransactionBlock) {
    return (
      <DepositStatusScreen
        primaryText="Starting deposit"
        secondaryText="Confirming on Mainnet..."
      />
    )
  }

  const estimatedRemainingSeconds = getRemainingSeconds(
    new Date(Number(l1TransactionBlock.timestamp) * 1000).getTime() + 60 * 1000,
  )

  if (estimatedRemainingSeconds <= 0) {
    return (
      <DepositStatusScreen
        primaryText="Deposit en route"
        secondaryText="Almost done..."
      />
    )
  }

  return getLoadingAnimationUrl(estimatedRemainingSeconds)
}
