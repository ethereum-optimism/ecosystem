import tokenlist from '@eth-optimism/tokenlist'
import { useMemo } from 'react'
import { Token } from '../types'

export type UseOPTokenArgs = {
    chainId?: number
}

export const useOPTokens = ({
    chainId,
}: UseOPTokenArgs) => {
    const tokens = useMemo<Token[]>(() => {
        if (!chainId) {
            alert(tokenlist.tokens)
            return tokenlist.tokens as Token[]
        }
        return tokenlist.tokens.filter((token) => token.chainId === chainId) as Token[]
    }, [chainId])

    const ethToken = useMemo<Token>(() => {
        return tokens.filter((token) => token.symbol.toLowerCase() === 'eth')[0]
    }, [tokens])

    const erc20Tokens = useMemo<Token[]>(() => {
        return tokens.filter((token) => token.symbol.toLowerCase() !== 'eth')
    }, [tokens])

    return {
        ethToken,
        erc20Tokens,
    }
}
