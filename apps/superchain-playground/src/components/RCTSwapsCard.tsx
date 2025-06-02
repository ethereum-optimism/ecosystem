import type { Network } from '@eth-optimism/viem/chains'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useState } from 'react'
import { type Chain, zeroAddress } from 'viem';
import { useAccount } from 'wagmi'

import { TokenAmountInput } from '@/components/TokenAmountInput'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAddLiquidity } from '@/hooks/uniswap/useAddLiquidity';
import { useApproval } from '@/hooks/uniswap/useApprovals';
import { getLiquidityForAmounts, MAX_SQRT_PRICE, MIN_SQRT_PRICE, usePriceFromSqrtPriceX96 } from '@/hooks/uniswap/useLiquidityAmounts';
import { usePoolSwap } from '@/hooks/uniswap/usePoolSwap';
import { usePool } from '@/hooks/uniswap/useStateViewPool'
import { useTokenList } from '@/stores/useTokenList'
import type { Token } from '@/types/Token'

export const RCTSwapsCard = ({ network, selectedChain }: { network: Network, selectedChain: Chain }) => {
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
          <RCTSwaps network={network} selectedChain={selectedChain} />
        </TabsContent>
        <TabsContent key="pools" value="pools">
          <RCTPools network={network} selectedChain={selectedChain} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const RCTPools = ({ network, selectedChain }: { network: Network, selectedChain: Chain }) => {
  const { address } = useAccount()
  const { tokens } = useTokenList()

  const [token0, setToken0] = useState<Token>(tokens[0]!)
  const [token1, setToken1] = useState<Token>(tokens[1]!)
  const tokenPair = { token0, token1 }

  const { sqrtPriceX96, initialized, initializePool, isPending: pendingInitialization } = usePool({ tokenPair, selectedChain })

  const [amount0, setAmount0] = useState(0)

  // Derive amount1 from the current spot price
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
      <div className="flex flex-col gap-2">
        <Label>Token 0</Label>
        <TokenAmountInput
          tokenList={tokens.filter(t => t.symbol !== token1!.symbol)}
          selectedToken={token0!}
          onTokenChange={setToken0}
          amount={amount0}
          onAmountChange={setAmount0}
          network={network}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Token 1</Label>
        <TokenAmountInput
          tokenList={tokens.filter(t => t.symbol !== token0!.symbol)}
          selectedToken={token1!}
          onTokenChange={setToken1}
          amount={amount1}
          onAmountChange={() => {}}
          network={network}
          readOnly
        />
      </div>
        <Button
        className="w-full"
        disabled={(initialized && amount0 === 0) || (!initialized && pendingInitialization)}
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

export const RCTSwaps = ({ network, selectedChain }: { network: Network, selectedChain: Chain }) => {
  const { address } = useAccount()
  const { tokens } = useTokenList()

  const [token0, setToken0] = useState<Token>(tokens[0]!)
  const [token1, setToken1] = useState<Token>(tokens[1]!)
  const tokenPair = { token0, token1 }

  const { initialized, sqrtPriceX96 } = usePool({ tokenPair, selectedChain })

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
      <div className="flex flex-col gap-2">
        <Label>Sell</Label>
        <TokenAmountInput
          tokenList={tokens.filter(t => t.symbol !== token1.symbol)}
          selectedToken={token0!}
          onTokenChange={setToken0}
          amount={amount0}
          onAmountChange={setAmount0}
          network={network}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Buy</Label>
        <TokenAmountInput
          tokenList={tokens.filter(t => t.symbol !== token0.symbol)}
          selectedToken={token1!}
          onTokenChange={setToken1}
          amount={amount1}
          onAmountChange={() => {}}
          network={network}
          readOnly
        />
      </div>
      <Button
        className="w-full"
        disabled={!initialized || !amount0 || amount0 === 0 || isPending}
        onClick={() => {
          if (requiresApproval0) approve0()
          else swap()
        }}
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
