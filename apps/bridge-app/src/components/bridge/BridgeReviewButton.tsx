import type { NetworkPair, Token } from '@eth-optimism/op-app'

import { useIsNetworkUnsupported, useSwitchNetworkDirection } from '@eth-optimism/op-app'

import { Button } from '@/components/ui/button'
import { useAccount } from 'wagmi'
import { Chain, parseEther } from 'viem'
import { ReviewDepositDialog } from '@/components/bridge/ReviewDepositDialog'
import { ReviewWithdrawalDialog } from '@/components/bridge/ReviewWithdrawalDialog'

export type BridgeSubmitButtonProps = {
  action: 'deposit' | 'withdrawal'
  amount?: string
  networkPair: NetworkPair
  selectedTokenPair: [Token, Token]
  validationError?: string
  onSubmit?: () => void
}

export const BridgeReviewButton = ({
  action,
  amount,
  validationError,
  networkPair,
  selectedTokenPair,
  onSubmit,
}: BridgeSubmitButtonProps) => {
  const { chain } = useAccount()
  const { isUnsupported } = useIsNetworkUnsupported()

  const { switchNetworkPair: switchToL1 } = useSwitchNetworkDirection({
    networkPair,
    direction: 'l1',
  })
  const { switchNetworkPair: switchToL2 } = useSwitchNetworkDirection({
    networkPair,
    direction: 'l2',
  })

  const shouldDisableReview =
    parseEther(amount ?? '0') <= 0 || !!validationError

  if (isUnsupported) {
    return <Button disabled>Unsupported Network</Button>
  }

  if (!chain) {
    return <Button disabled>Connect Wallet</Button>
  }

  if (action === 'deposit' && networkPair.l1.id !== chain?.id) {
    return (
      <Button onClick={() => switchToL1()}>
        Switch to {networkPair.l1.name}
      </Button>
    )
  }

  if (action === 'withdrawal' && networkPair.l2.id !== chain?.id) {
    return (
      <Button onClick={() => switchToL2()}>
        Switch to {networkPair.l2.name}
      </Button>
    )
  }

  return action === 'deposit' ? (
    <ReviewDepositDialog
      l1={networkPair.l1 as Chain}
      l2={networkPair.l2 as Chain}
      amount={amount ?? '0'}
      disabled={shouldDisableReview}
      selectedTokenPair={selectedTokenPair}
      onSubmit={onSubmit}
    />
  ) : (
    <ReviewWithdrawalDialog
      l1={networkPair.l1 as Chain}
      l2={networkPair.l2 as Chain}
      amount={amount ?? '0'}
      disabled={shouldDisableReview}
      selectedTokenPair={selectedTokenPair}
      onSubmit={onSubmit}
    />
  )
}
