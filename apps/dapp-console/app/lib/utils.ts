import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { optimism, optimismSepolia } from 'viem/chains'
import { superchainIdMap } from '@/app/constants/superchain'
import { formatEther } from 'viem'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDateString(date: Date) {
  return date.toLocaleString('default', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export function getRebateBlockExplorerUrl(chainId: number) {
  const config = superchainIdMap[chainId]

  if (!config) {
    throw new Error('Cannot find chainId')
  }

  const chain = [config.mainnet, ...config.testnets].find(
    (chain) => chain?.id === chainId,
  )
  return chain?.testnet
    ? optimismSepolia.blockExplorers.default.url
    : optimism.blockExplorers.default.url
}

export function formatEtherShort(amount: bigint, unit?: 'wei' | 'gwei') {
  const amountStr = formatEther(amount, unit)
  const [beforeDecimal, afterDecimal] = amountStr.split('.')

  if (!afterDecimal) {
    return amountStr
  }

  if (afterDecimal.length > 8) {
    let valueWithoutTrailingZeros = afterDecimal.substring(0, 8)

    while (
      valueWithoutTrailingZeros[valueWithoutTrailingZeros.length - 1] === '0'
    ) {
      valueWithoutTrailingZeros = valueWithoutTrailingZeros.substring(
        0,
        valueWithoutTrailingZeros.length - 1,
      )
    }

    return [beforeDecimal, valueWithoutTrailingZeros].join('.')
  }

  return amountStr
}
