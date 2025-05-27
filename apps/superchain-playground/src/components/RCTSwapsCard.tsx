import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useState } from 'react'
import type { Address} from 'viem';
import { parseEther, zeroAddress } from 'viem'
import { useAccount, useBalance, useWriteContract } from 'wagmi'

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
import { useAddLiquidity } from '@/hooks/uniswap/useAddLiquidity';
import { useInitializePool } from '@/hooks/uniswap/useInitializePool';
import { getLiquidityForAmounts, MAX_SQRT_PRICE, MIN_SQRT_PRICE, usePriceFromSqrtPriceX96 } from '@/hooks/uniswap/useLiquidityAmounts';
import { usePoolSwap } from '@/hooks/uniswap/usePoolSwap';
import { useStateViewPool } from '@/hooks/uniswap/useStateViewPool'
import { truncateDecimal } from '@/utils/truncateDecimal'

// Reusable TokenAmountInput component
interface Token {
  symbol: string
  name: string
  address?: Address
  decimals: number
}

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

  const { data } = useBalance({ address, token: selectedToken?.address, query: { enabled: !!address } })
  const { formatted: balance } = data ?? { formatted: '-' }

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
      {balance !== undefined && (
        <span className="text-xs text-muted-foreground">
          Balance: {truncateDecimal(balance)} {selectedToken.symbol}
        </span>
      )}
    </div>
  )
}

const TOKENS = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
  } as Token,
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
  } as Token,
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    decimals: 6,
  } as Token
]

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

  const [token0, setToken0] = useState(TOKENS[0])
  const [token1, setToken1] = useState(TOKENS[1])

  const { initializePool, isPending: pendingInitialization } = useInitializePool({
    buyToken: token0?.address ?? zeroAddress,
    sellToken: token1?.address ?? zeroAddress,
  })

  const { sqrtPriceX96, initialized } = useStateViewPool({
    sellToken: token0?.address ?? zeroAddress,
    buyToken: token1?.address ?? zeroAddress,
  })

  const [amount0, setAmount0] = useState(0)

  const price = usePriceFromSqrtPriceX96(sqrtPriceX96)
  const amount1 = sqrtPriceX96 ? amount0 * Number(price) : 0

  const liquidityAmount = getLiquidityForAmounts(sqrtPriceX96, MIN_SQRT_PRICE, MAX_SQRT_PRICE, BigInt(amount0 * 10 ** token0!.decimals), BigInt(amount1 * 10 ** token1!.decimals))
  console.log(`SQRTX96: ${sqrtPriceX96}, PRICE: ${price}, LIQUIDITY: ${liquidityAmount}, AMOUNT0: ${amount0}, AMOUNT1: ${amount1}`)

  const { addLiquidity, isPending: pendingAddLiquidity } = useAddLiquidity({
    token0: token0?.address ?? zeroAddress,
    token1: token1?.address ?? zeroAddress,

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
        onClick={() => { !initialized ? initializePool() : addLiquidity() }}>
        { !address ? 'Connect Wallet' :
            !initialized ? pendingInitialization ? 'Initializing...' : 'Initialize Pool' :
            pendingAddLiquidity ? 'Adding Liquidity...' : 'Add Liquidity'
        }
      </Button>
    </div>
  )
}

export const RCTSwaps = () => {
  const { address } = useAccount()

  const [sellToken, setSellToken] = useState(TOKENS[0])
  const [buyToken, setBuyToken] = useState(TOKENS[1])

  const [amount, setAmount] = useState('')

  const { data } = useBalance({ address, token: sellToken?.address, query: { enabled: !!address } })
  const { formatted: balance } = data ?? { formatted: '-' }

  const { initialized } = useStateViewPool({
    sellToken: sellToken?.address ?? zeroAddress,
    buyToken: buyToken?.address ?? zeroAddress,
  })

  const { swap, isPending, estimatedAmountOut } = usePoolSwap({
    sellToken: sellToken?.address ?? zeroAddress,
    buyToken: buyToken?.address ?? zeroAddress,
    amountIn: Number(amount),
  })

  // Swap logic placeholder
  const { writeContract } = useWriteContract()
  const handleSwap = () => {
    if (!amount || !address || !buyToken!.address) return
    writeContract({
      address: buyToken!.address,
      abi: [
        {
          name: 'deposit',
          type: 'function',
          stateMutability: 'payable',
          inputs: [],
          outputs: [],
        },
      ],
      functionName: 'deposit',
      value: parseEther(amount),
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <TokenAmountInput
        label="Sell"
        tokenList={TOKENS.filter(t => t.symbol !== buyToken!.symbol)}
        selectedToken={sellToken!}
        onTokenChange={setSellToken}
        amount={amount}
        onAmountChange={setAmount}
        balance={truncateDecimal(balance)}
      />
      <TokenAmountInput
        label="Buy"
        tokenList={TOKENS.filter(t => t.symbol !== sellToken!.symbol)}
        selectedToken={buyToken!}
        onTokenChange={setBuyToken}
        amount={estimatedAmountOut ? truncateDecimal(estimatedAmountOut.toString()) : '-'}
        onAmountChange={() => {}}
        readOnly
      />
      <Button
        onClick={handleSwap}
        disabled={!initialized || !amount || !estimatedAmountOut}
        className="w-full"
      >
        {initialized ? 'Swap' : 'Uninitialized Pool'}
      </Button>
    </div>
  )
}
