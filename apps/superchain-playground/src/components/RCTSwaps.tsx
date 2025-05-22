import type { Network } from '@eth-optimism/viem/chains'
import { useState } from 'react'
import { parseEther } from 'viem'
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

const TOKENS = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: undefined as `0x${string}` | undefined, // Native ETH
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    decimals: 18,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607' as `0x${string}`,
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    decimals: 6,
  },
  {
    symbol: 'DAI',
    name: 'Dai',
    address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1' as `0x${string}`,
    logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
    decimals: 18,
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006' as `0x${string}`,
    logo: 'https://cryptologos.cc/logos/wrapped-ethereum-weth-logo.png',
    decimals: 18,
  },
]

export const RCTSwaps = ({network}: {network: Network}) => {
  const [sellToken, setSellToken] = useState(TOKENS[0])
  const [buyToken, setBuyToken] = useState(TOKENS[1])
  const [amount, setAmount] = useState('')
  const { address } = useAccount()

  const { data: sellBalance } = useBalance({
    address,
    token: sellToken!.address,
  })

  // Dummy buy amount for now (1:1)
  const buyAmount = amount

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
    <div className="max-w-md w-full mx-auto flex flex-col gap-6 p-6 border rounded-xl bg-background">
      {/* Sell Section */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="sell-token">Sell</Label>
        <div className="flex gap-2">
          <Select
            value={sellToken!.symbol}
            onValueChange={val => {
              const token = TOKENS.find(t => t.symbol === val)
              if (token) setSellToken(token)
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <img src={sellToken!.logo} alt={sellToken!.symbol} className="w-5 h-5" />
                  {sellToken!.symbol}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TOKENS.filter(t => t.symbol !== buyToken!.symbol).map(token => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  <div className="flex items-center gap-2">
                    <img src={token.logo} alt={token.symbol} className="w-5 h-5" />
                    {token.symbol}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="sell-amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.0"
            min="0"
            className="flex-1"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Balance: {sellBalance?.formatted || '0'} {sellToken!.symbol}
        </span>
      </div>
      {/* Buy Section */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="buy-token">Buy</Label>
        <div className="flex gap-2">
          <Select
            value={buyToken!.symbol}
            onValueChange={val => {
              const token = TOKENS.find(t => t.symbol === val)
              if (token) setBuyToken(token)
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <img src={buyToken!.logo} alt={buyToken!.symbol} className="w-5 h-5" />
                  {buyToken!.symbol}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TOKENS.filter(t => t.symbol !== sellToken!.symbol).map(token => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  <div className="flex items-center gap-2">
                    <img src={token.logo} alt={token.symbol} className="w-5 h-5" />
                    {token.symbol}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="buy-amount"
            type="number"
            value={buyAmount}
            readOnly
            placeholder="0.0"
            className="flex-1"
          />
        </div>
      </div>
      {/* Swap Button */}
      <Button onClick={handleSwap} disabled={!amount} className="w-full">
        Swap
      </Button>
    </div>
  )
}
