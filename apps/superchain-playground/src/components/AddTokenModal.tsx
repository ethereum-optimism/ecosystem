import type { Network } from '@eth-optimism/viem/chains'
import { useState } from 'react'
import type { Address, Chain } from 'viem'

import { ChainPicker } from '@/components/ChainPicker'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTokenInfo } from '@/hooks/useTokenInfo'
import { useTokenList } from '@/stores/useTokenList'

interface AddTokenModalProps {
  network: Network
}

export const AddTokenModal = ({ network }: AddTokenModalProps) => {
  const [address, setAddress] = useState<Address>()
  const { addToken, clearTokens } = useTokenList()

  const [name, setName] = useState<string | undefined>()
  const [symbol, setSymbol] = useState<string | undefined>()
  const [decimals, setDecimals] = useState<number>(18)
  const [selectedChain, setSelectedChain] = useState<Chain | undefined>()
  const [open, setOpen] = useState(false)

  const { tokenData, isLoading } = useTokenInfo({ address, chainId: selectedChain?.id ?? 0 })
  const hasRequiredFields = (!!name || tokenData?.name) && (!!symbol || tokenData?.symbol)

  const clearInputs = () => {
    setName(undefined)
    setSymbol(undefined)
    setDecimals(18)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground">
          + Add / Change Token
        </Button>
      </DialogTrigger>
      <DialogContent className="pr-8">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle>Set Token Details</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => {
              clearTokens()
              setOpen(false)
            }}
          >
            Reset TokenList to defaults
          </Button>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Label className="w-20">Chain</Label>
            <ChainPicker network={network} selectedChain={selectedChain} setSelectedChain={setSelectedChain} />
          </div>
          <div className="flex items-center gap-4">
            <Label className="w-20">Address</Label>
            <Input
              value={address}
              disabled={!selectedChain}
              onChange={(e) => { clearInputs(); setAddress(e.target.value as Address) }}
              placeholder="0x..."
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <Label className="w-20">Name</Label>
            <Input
              value={name}
              placeholder={tokenData?.name ?? '-'}
              disabled={isLoading || !tokenData}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="w-20">Symbol</Label>
            <Input
              value={symbol}
              placeholder={tokenData?.symbol ?? '-'}
              disabled={isLoading || !tokenData}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="w-20">Decimals</Label>
            <Input
              type="number"
              placeholder={tokenData?.decimals?.toString() ?? '18'}
              value={decimals}
              disabled={isLoading || !tokenData}
              onChange={(e) => setDecimals(Number(e.target.value))}
            />
          </div>
          <Button
            disabled={!selectedChain || isLoading || !hasRequiredFields}
            onClick={() => {
              addToken({
                address,
                name: name || tokenData?.name || '',
                symbol: symbol || tokenData?.symbol || '',
                decimals: decimals || tokenData?.decimals || 18,
                nativeChainId: selectedChain?.id,
              })
              setOpen(false)
              clearInputs()
            }}
          >
            { !selectedChain ? 'Select a chain' :
              isLoading ? 'Loading...' :
              !tokenData ? 'Token Not Found' :
              !hasRequiredFields ? 'Missing Fields' :
              'Add Token'
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
