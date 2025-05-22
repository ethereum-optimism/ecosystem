import type { Network } from '@eth-optimism/viem/chains'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useState } from 'react'
import { type Chain } from 'viem';
import { useAccount } from 'wagmi'

import { TokenAmountInput } from '@/components/TokenAmountInput'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { POSM_ADDRESS, V4_ROUTER_ADDRESS } from '@/hooks/uniswap/addresses'
import { useApproval } from '@/hooks/uniswap/useApprovals';
import { useERC20Reference } from '@/hooks/uniswap/useERC20Reference'
import { getLiquidityForAmounts, MAX_SQRT_PRICE, MIN_SQRT_PRICE, usePriceFromSqrtPriceX96 } from '@/hooks/uniswap/useLiquidityAmounts';
import { usePool } from '@/hooks/uniswap/usePool'
import { usePoolLiquidity } from '@/hooks/uniswap/usePoolLiquidity';
import { usePoolSwap } from '@/hooks/uniswap/usePoolSwap';
import { useTokenList } from '@/stores/useTokenList'
import type { Token } from '@/types/Token'

export const RCTSwapsCard = ({ network, selectedChain }: { network: Network, selectedChain: Chain }) => {
  const { tokens } = useTokenList()

  const chainIds = network.chains.map(c => c.id)
  const eligibleTokens = tokens.filter(t => !t.nativeChainId || chainIds.includes(t.nativeChainId))

  const [tab, setTab] = useState('swaps')

  // ETH & WETH are the first two default tokens
  const [token0, setToken0] = useState<Token>(tokens[0]!)
  const [token1, setToken1] = useState<Token>(tokens[1]!)

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
          <RCTSwaps
            selectedChain={selectedChain}
            tokens={eligibleTokens}
            token0={token0}
            setToken0={setToken0}
            token1={token1}
            setToken1={setToken1}
          />
        </TabsContent>
        <TabsContent key="pools" value="pools">
          <RCTPools
            selectedChain={selectedChain}
            tokens={eligibleTokens}
            token0={token0}
            setToken0={setToken0}
            token1={token1}
            setToken1={setToken1}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const RCTPools = ({
  selectedChain,
  tokens,
  token0,
  setToken0,
  token1,
  setToken1,
}: {
  selectedChain: Chain,
  tokens: Token[],
  token0: Token,
  setToken0: (token: Token) => void,
  token1: Token,
  setToken1: (token: Token) => void,
}) => {
  const { address } = useAccount()

  const tokenPair = { token0, token1 }

  const [amount0, setAmount0] = useState(0)

  const {
    requiresReference: requiresReferenceToken0,
    initializeReference: initializeReferenceToken0,
    isPending: isPendingReferenceToken0,
  } = useERC20Reference({ token: token0, chain: selectedChain })

  const {
    requiresReference: requiresReferenceToken1,
    initializeReference: initializeReferenceToken1,
    isPending: isPendingReferenceToken1,
  } = useERC20Reference({ token: token1, chain: selectedChain })

  const isPendingReference = (requiresReferenceToken0 && isPendingReferenceToken0) || (requiresReferenceToken1 && isPendingReferenceToken1)

  const {
    sqrtPriceX96,
    initialized,
    initializePool,
    isPending: isPendingInitializePool,
  } = usePool({ tokenPair, chain: selectedChain })

  // Derive amount1 from the current spot price
  const price = usePriceFromSqrtPriceX96(sqrtPriceX96)
  const amount1 = sqrtPriceX96 ? amount0 * Number(price) : 0

  const liquidityAmount = getLiquidityForAmounts(sqrtPriceX96, MIN_SQRT_PRICE, MAX_SQRT_PRICE, BigInt(amount0 * 10 ** token0!.decimals), BigInt(amount1 * 10 ** token1!.decimals))

  const { approve: approve0, isPending: pendingApproval0, requiresApproval: requiresApproval0 } = useApproval({
    token: token0!,
    amount: BigInt(amount0 * 10 ** token0!.decimals) + 1n,
    chain: selectedChain,
    spender: POSM_ADDRESS,
  })

  const { approve: approve1, isPending: pendingApproval1, requiresApproval: requiresApproval1 } = useApproval({
    token: token1!,
    amount: BigInt(amount1 * 10 ** token1!.decimals) + 1n,
    chain: selectedChain,
    spender: POSM_ADDRESS,
  })

  const { addLiquidity, isPending: isPendingAddLiquidity } = usePoolLiquidity({
    tokenPair,
    amounts: {
      amount0Max: amount0 * 10 ** token0!.decimals + 1,
      amount1Max: amount1 * 10 ** token1!.decimals + 1,
      liquidityAmount: Number(liquidityAmount),
    },
    chain: selectedChain,
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <Label>Token 0</Label>
        <TokenAmountInput
          chainId={selectedChain.id}
          tokens={tokens.filter(t => t.symbol !== token1!.symbol)}
          selectedToken={token0!}
          onTokenChange={setToken0}
          amount={amount0}
          onAmountChange={setAmount0}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Token 1</Label>
        <TokenAmountInput
          chainId={selectedChain.id}
          tokens={tokens.filter(t => t.symbol !== token0!.symbol)}
          selectedToken={token1!}
          onTokenChange={setToken1}
          amount={amount1}
          onAmountChange={() => {}}
          readOnly
        />
      </div>
        <Button
        className="w-full"
        disabled={(initialized && amount0 === 0) || (!initialized && (isPendingReference || isPendingInitializePool || isPendingAddLiquidity))}
        onClick={() => {
          if (requiresReferenceToken0 || requiresReferenceToken1) {
            if (requiresReferenceToken0) initializeReferenceToken0()
            if (requiresReferenceToken1) initializeReferenceToken1()
          }
          else if (!initialized) {
            initializePool()
          }
          else if (requiresApproval0 || requiresApproval1) {
            if (requiresApproval0) approve0()
            if (requiresApproval1) approve1()
          }
          else {
            addLiquidity()
          }
        }}>
        { !address ? 'Connect Wallet' :

            // Reference Requirements
            requiresReferenceToken0 ? isPendingReferenceToken0 ? 'Deploying Reference' : `Deploy ref${token0.symbol}` :
            requiresReferenceToken1 ? isPendingReferenceToken1 ? 'Deploying Reference' : `Deploy ref${token1.symbol}` :

            // Initialization
            !initialized ? isPendingInitializePool ? 'Initializing...' : 'Initialize Pool' :

            // Approval
            (requiresApproval0 || requiresApproval1) ? (pendingApproval0 || pendingApproval1) ? 'Approving...' : 'Approve' :

            // Liquidity Addition
            isPendingAddLiquidity ? 'Adding Liquidity...' : 'Add Liquidity'
        }
      </Button>
    </div>
  )
}

export const RCTSwaps = ({
  selectedChain,
  tokens,
  token0,
  setToken0,
  token1,
  setToken1,
}: {
  selectedChain: Chain,
  tokens: Token[],
  token0: Token,
  setToken0: (token: Token) => void,
  token1: Token,
  setToken1: (token: Token) => void,
}) => {
  const { address } = useAccount()

  const tokenPair = { token0, token1 }
  const { initialized, sqrtPriceX96 } = usePool({ tokenPair, chain: selectedChain })

  const [amount0, setAmount0] = useState(0)

  const price = usePriceFromSqrtPriceX96(sqrtPriceX96)
  const amount1 = sqrtPriceX96 ? !token0.address ? amount0 * Number(price) : amount0 / Number(price) : 0

  const { approve: approve0, isPending: pendingApproval0, requiresApproval: requiresApproval0 } = useApproval({
    token: token0!,
    amount: BigInt(amount0 * 10 ** token0!.decimals) + 1n,
    chain: selectedChain,
    spender: V4_ROUTER_ADDRESS,
  })

  const { swap, isPending } = usePoolSwap({
    tokenPair,
    amount0In: amount0 * 10 ** token0!.decimals,
    chain: selectedChain,
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <Label>Sell</Label>
        <TokenAmountInput
          chainId={selectedChain.id}
          tokens={tokens.filter(t => t.symbol !== token1.symbol)}
          selectedToken={token0!}
          onTokenChange={setToken0}
          amount={amount0}
          onAmountChange={setAmount0}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Buy</Label>
        <TokenAmountInput
          chainId={selectedChain.id}
          tokens={tokens.filter(t => t.symbol !== token0.symbol)}
          selectedToken={token1!}
          onTokenChange={setToken1}
          amount={amount1}
          onAmountChange={() => {}}
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
