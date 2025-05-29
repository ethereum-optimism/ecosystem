import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useState } from 'react'
import type { Address} from 'viem';
import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ERC20_ADDRESS , ERC20REF_ADDRESS } from '@/hooks/uniswap/addresses';
import { useAddLiquidity } from '@/hooks/uniswap/useAddLiquidity';
import { useApproval } from '@/hooks/uniswap/useApprovals';
import { useCrosschainBalance } from '@/hooks/uniswap/useCrosschainBalance'
import { useInitializePool } from '@/hooks/uniswap/useInitializePool';
import { getLiquidityForAmounts, MAX_SQRT_PRICE, MIN_SQRT_PRICE, usePriceFromSqrtPriceX96 } from '@/hooks/uniswap/useLiquidityAmounts';
import { usePoolSwap } from '@/hooks/uniswap/usePoolSwap';
import { useStateViewPool } from '@/hooks/uniswap/useStateViewPool'
import { truncateDecimal } from '@/utils/truncateDecimal'

// Reusable TokenAmountInput component
interface Token {
  symbol: string
  name: string
  decimals: number

  nativeChainId?: number

  address?: Address
  refAddress?: Address
}

const TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', decimals: 18 } as Token,
  { symbol: 'TST.B', name: 'Test Coin', address: ERC20_ADDRESS, decimals: 18, nativeChainId: 902, refAddress: ERC20REF_ADDRESS, } as Token,
  { symbol: 'WETH', name: 'Wrapped Ether', address: '0x4200000000000000000000000000000000000006', decimals: 18 } as Token,
]

interface TokenAmountInputProps {
  label: string
  tokenList: Token[]
  selectedToken: Token
  onTokenChange: (token: Token) => void
  amount: number
  onAmountChange: (amount: number) => void
  readOnly?: boolean
  balance?: string
}

function TokenAmountInput({
  label,
  tokenList,
  selectedToken,
  onTokenChange,
  amount,
  onAmountChange,
  readOnly = false,
}: TokenAmountInputProps) {
  const { address } = useAccount()

  const { balance, remoteBalance, localRefBalance } = useCrosschainBalance({ owner: address, token: selectedToken })
  const formattedBalance = balance ? truncateDecimal((Number(balance) / 10 ** selectedToken.decimals).toString()) : '-'

  if (selectedToken.refAddress) {
    console.log(`LocalRefBalance: ${truncateDecimal((Number(localRefBalance) / 10 ** selectedToken.decimals).toString())}, RemoteBalance: ${truncateDecimal((Number(remoteBalance) / 10 ** selectedToken.decimals).toString())}`)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Select
          value={selectedToken.symbol}
          onValueChange={val => {
            const token = tokenList.find(t => t.symbol === val)
            if (token) onTokenChange(token)
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue>
              <div className="flex items-center gap-2">
                {selectedToken.symbol}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {tokenList.map(token => (
              <SelectItem key={token.symbol} value={token.symbol}>
                <div className="flex items-center gap-2">
                  {token.symbol}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={truncateDecimal(amount.toString())}
          onChange={e => onAmountChange(Number(e.target.value))}
          placeholder="0.0"
          min="0"
          className="flex-1"
          readOnly={readOnly}
        />
      </div>
        <span className="text-xs text-muted-foreground">
        Balance: {formattedBalance} {selectedToken.symbol}
      </span>
    </div>
  )
}

export const RCTSwapsCard = () => {
  const [tab, setTab] = useState('swaps')
  return (
    <div className="max-w-md w-full mx-auto flex flex-col gap-6 p-6 border rounded-xl bg-background">
      <Tabs defaultValue="swaps" value={tab}>
        <TabsList className="w-full flex">
          <TabsTrigger key="swaps" value="swaps" className="flex-1 relative" onClick={() => setTab('swaps')}>
            Swaps
          </TabsTrigger>
          <TabsTrigger key="pools" value="pools" className="flex-1 relative" onClick={() => setTab('pools')}>
            Pools
          </TabsTrigger>
        </TabsList>
        <TabsContent key="swaps" value="swaps">
          <RCTSwaps />
        </TabsContent>
        <TabsContent key="pools" value="pools">
          <RCTPools />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const RCTPools = () => {
  const { address } = useAccount()

  const [token0, setToken0] = useState<Token>(TOKENS[0]!)
  const [token1, setToken1] = useState<Token>(TOKENS[1]!)
  const tokenPair = { token0, token1 }

  const { initializePool, isPending: pendingInitialization } = useInitializePool(tokenPair)
  const { sqrtPriceX96, initialized } = useStateViewPool(tokenPair)

  const [amount0, setAmount0] = useState(0)

  const price = usePriceFromSqrtPriceX96(sqrtPriceX96)
  const amount1 = sqrtPriceX96 ? amount0 * Number(price) : 0

  const liquidityAmount = getLiquidityForAmounts(sqrtPriceX96, MIN_SQRT_PRICE, MAX_SQRT_PRICE, BigInt(amount0 * 10 ** token0!.decimals), BigInt(amount1 * 10 ** token1!.decimals))
  console.log(`SQRTX96: ${sqrtPriceX96}, PRICE: ${price}, LIQUIDITY: ${liquidityAmount}, AMOUNT0: ${amount0}, AMOUNT1: ${amount1}`)

  const { approve: approve0, isPending: pendingApproval0, requiresApproval: requiresApproval0 } = useApproval({
    token: token0!,
    amount: BigInt(amount0 * 10 ** token0!.decimals) + 1n,
    owner: address ?? zeroAddress,
  })

  const { approve: approve1, isPending: pendingApproval1, requiresApproval: requiresApproval1 } = useApproval({
    token: token1!,
    amount: BigInt(amount1 * 10 ** token1!.decimals) + 1n,
    owner: address ?? zeroAddress,
  })

  const { addLiquidity, isPending: pendingAddLiquidity } = useAddLiquidity({
    ...tokenPair,

    // pad with 1 for some rounding errors
    amount0Max: amount0 * 10 ** token0!.decimals + 1,
    amount1Max: amount1 * 10 ** token1!.decimals + 1,

    owner: address ?? zeroAddress,
    liquidityAmount: Number(liquidityAmount),
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <TokenAmountInput
        label="Token"
        tokenList={TOKENS.filter(t => t.symbol !== token1!.symbol)}
        selectedToken={token0!}
        onTokenChange={setToken0}
        amount={amount0}
        onAmountChange={setAmount0}
      />
      <TokenAmountInput
        label="Token"
        tokenList={TOKENS.filter(t => t.symbol !== token0!.symbol)}
        selectedToken={token1!}
        onTokenChange={setToken1}
        amount={amount1}
        onAmountChange={() => {}}
        readOnly
      />
      <Button
        className="w-full"
        disabled={!initialized && pendingInitialization}
        onClick={() => {
          if (!initialized) {
            initializePool()
          } else if (requiresApproval0 || requiresApproval1) {

            if (requiresApproval0) approve0()
            if (requiresApproval1) approve1()

          } else {
            addLiquidity()
          }
        }}>
        { !address ? 'Connect Wallet' :

            !initialized ? pendingInitialization ? 'Initializing...' : 'Initialize Pool' :

            (requiresApproval0 || requiresApproval1) ? (pendingApproval0 || pendingApproval1) ? 'Approving...' : 'Approve' :

            pendingAddLiquidity ? 'Adding Liquidity...' : 'Add Liquidity'
        }
      </Button>
    </div>
  )
}

export const RCTSwaps = () => {
  const { address } = useAccount()

  const [token0, setToken0] = useState<Token>(TOKENS[0]!)
  const [token1, setToken1] = useState<Token>(TOKENS[1]!)
  const tokenPair = { token0, token1 }

  const { initialized, sqrtPriceX96 } = useStateViewPool(tokenPair)

  const [amount0, setAmount0] = useState(0)

  const price = usePriceFromSqrtPriceX96(sqrtPriceX96)
  const amount1 = sqrtPriceX96 ? !token0.address ? amount0 * Number(price) : amount0 / Number(price) : 0

  const { approve: approve0, isPending: pendingApproval0, requiresApproval: requiresApproval0 } = useApproval({
    token: token0!,
    amount: BigInt(amount0 * 10 ** token0!.decimals) + 1n,
    owner: address ?? zeroAddress,
  })

  const { swap, isPending } = usePoolSwap({
    ...tokenPair,
    amount0In: amount0 * 10 ** token0!.decimals,
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <TokenAmountInput
        label="Sell"
        tokenList={TOKENS.filter(t => t.symbol !== token1.symbol)}
        selectedToken={token0!}
        onTokenChange={setToken0}
        amount={amount0}
        onAmountChange={setAmount0}
      />
      <TokenAmountInput
        label="Buy"
        tokenList={TOKENS.filter(t => t.symbol !== token0.symbol)}
        selectedToken={token1!}
        onTokenChange={setToken1}
        amount={amount1}
        onAmountChange={() => {}}
        readOnly
      />
      <Button
        onClick={() => {
          if (requiresApproval0) approve0()
          else swap()
        }}
        disabled={!initialized || !amount0 || amount0 === 0 || isPending}
        className="w-full"
      >
        { !address ? 'Connect Wallet' :

            !initialized ? 'Uninitialized Pool' :

            (requiresApproval0) ? (pendingApproval0) ? 'Approving...' : 'Approve' :

            isPending ? 'Swapping...' : 'Swap'
        }
      </Button>
    </div>
  )
}
