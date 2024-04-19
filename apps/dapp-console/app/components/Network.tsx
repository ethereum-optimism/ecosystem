import { useMemo } from 'react'
import { superchainIdMap } from '@/app/constants/superchain'
import Image from 'next/image'
import { cn } from '@/app/lib/utils'

export type NetworkProps = {
  chainId: number
  size?: number
  className?: string
}

export const Network = ({ className, chainId, size = 25 }: NetworkProps) => {
  const config = useMemo(() => superchainIdMap[chainId], [chainId])

  const name = useMemo(() => {
    const testnet = config.testnets?.find((chain) => chain.id === chainId)
    if (testnet) {
      return testnet.name
    }
    return config.name
  }, [chainId, config])

  return (
    <div className={cn('flex flex-row gap-1 items-center', className)}>
      <Image
        className="rounded-full"
        width={size}
        height={size}
        src={config.logo}
        alt="Network Logo"
      />{' '}
      {name}
    </div>
  )
}
