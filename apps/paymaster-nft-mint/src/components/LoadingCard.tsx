import { Card } from '@eth-optimism/ui-components'
import { RiLoader4Line } from '@remixicon/react'

export const LoadingCard = () => {
  return (
    <Card className="w-[400px] h-[300px] flex justify-center items-center">
      <RiLoader4Line className="w-10 h-10 animate-spin" />
    </Card>
  )
}
