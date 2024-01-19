import { useOPTokens, Token } from '@eth-optimism/op-app'
import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@eth-optimism/ui-components'

import { Chain } from 'viem'

export type TokenListDialogProps = {
  l1: Chain
  l2: Chain
  selectedToken: Token
  onTokenChange: (l1Token: Token, l2Token: Token) => void
}

export const TokenListDialog = ({
  l1,
  l2,
  selectedToken,
  onTokenChange,
}: TokenListDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const { ethToken: l1EthToken, erc20Tokens: l1Erc20Tokens } = useOPTokens({
    chainId: l1.id,
  })
  const { ethToken: l2EthToken, erc20Tokens: l2Erc20Tokens } = useOPTokens({
    chainId: l2.id,
  })

  const l1Tokens = useMemo<Token[]>(() => {
    return [l1EthToken, ...l1Erc20Tokens]
  }, [l1EthToken, l1Erc20Tokens])

  const l2Tokens = useMemo<Token[]>(() => {
    return [l2EthToken, ...l2Erc20Tokens]
  }, [l2EthToken, l2Erc20Tokens])

  const onTokenClick = useCallback(
    (l2Token: Token) => {
      const l1Token = l1Tokens.find(
        (token) => token.extensions.opTokenId === l2Token.extensions.opTokenId,
      )
      if (!l1Token) {
        throw new Error(`Unable to find l1Token for ${l2Token.symbol}`)
      }
      onTokenChange(l1Token, l2Token)
      setIsDialogOpen(false)
    },
    [setIsDialogOpen, onTokenChange, l1Tokens],
  )

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-1 w-1/4 h-[40px]">
          <img
            className="max-w-[25%] h-[100%] mr-2"
            src={selectedToken.logoURI}
          />{' '}
          {selectedToken.symbol}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[50%] overflow-scroll pb-8 w-1/2">
        <DialogHeader>Token List</DialogHeader>

        <div className="flex flex-col w-full">
          {l2Tokens.map((token) => (
            <div
              className="flex flex-row p-2 h-[60px] cursor-pointer hover:bg-accent items-center"
              key={token.extensions.opTokenId}
              onClick={() => onTokenClick(token)}
            >
              <img className="max-w-[25%] h-[100%] mr-6" src={token.logoURI} />{' '}
              {token.symbol}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
