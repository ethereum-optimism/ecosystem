import { LONG_DURATION } from '@/app/constants/toast'
import { shortenHex } from '@eth-optimism/op-app'
import { Badge, toast } from '@eth-optimism/ui-components'
import { useCallback } from 'react'
import { Hex } from 'viem'

export type HexBadgeProps = {
  label: string
  value: Hex
}

export const HexBadge = ({ label, value }: HexBadgeProps) => {
  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(value)

    toast({
      description: `${shortenHex(value)} copied`,
      duration: LONG_DURATION,
    })
  }, [value])

  return (
    <Badge className="cursor-pointer" variant="secondary" onClick={handleClick}>
      {label}: {shortenHex(value)}
    </Badge>
  )
}
