import { Chain } from 'viem'
import { useOPTokens, Token } from '@eth-optimism/op-app'
import { BridgeReviewButton } from '@/components/bridge/BridgeReviewButton'
import { From } from '@/components/bridge/From'
import { To } from '@/components/bridge/To'
import { useCallback, useState } from 'react'
import { ArrowDown } from 'lucide-react'

export type BridgeFormProps = {
  l1: Chain
  l2: Chain
  action: 'deposit' | 'withdrawal'
}

export const BridgeForm = ({ l1, l2, action }: BridgeFormProps) => {
  const { ethToken: l1EthToken } = useOPTokens({ chainId: l1.id })
  const { ethToken: l2EthToken } = useOPTokens({ chainId: l2.id })

  const [amount, setAmount] = useState<string | undefined>(undefined)
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined,
  )
  const [selectedTokenPair, setSelectedTokenPair] = useState<[Token, Token]>([
    l1EthToken,
    l2EthToken,
  ])

  const [l1Token, l2Token] = selectedTokenPair

  const onSubmit = useCallback(() => {
    setAmount(undefined)
    setValidationError(undefined)
  }, [setAmount, setValidationError])

  const onTokenChange = useCallback(
    (l1Token: Token, l2Token: Token) => {
      setSelectedTokenPair([l1Token, l2Token])
    },
    [setSelectedTokenPair],
  )

  return (
    <div className="flex flex-col">
      <From
        l1={l1}
        l2={l2}
        action={action}
        amount={amount}
        selectedToken={action === 'deposit' ? l1Token : l2Token}
        onTokenChange={onTokenChange}
        onAmountChange={(amount) => setAmount(amount)}
        onValidationError={(validationError) =>
          setValidationError(validationError)
        }
      />
      <div className="w-full flex items-center justify-center py-3">
        <ArrowDown />
      </div>
      <To
        chain={action === 'deposit' ? l2 : l1}
        amount={amount}
        selectedToken={action === 'deposit' ? l2Token : l1Token}
      />
      <BridgeReviewButton
        action={action}
        amount={amount}
        networkPair={{ l1, l2 }}
        validationError={validationError}
        selectedTokenPair={selectedTokenPair}
        onSubmit={onSubmit}
      />
    </div>
  )
}
