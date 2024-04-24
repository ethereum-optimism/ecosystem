import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { optimism, optimismSepolia } from 'viem/chains'
import { superchainIdMap } from '@/app/constants/superchain'

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
