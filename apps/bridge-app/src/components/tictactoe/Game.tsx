import { cn } from '@/utils'
import { shortenAddress } from '@eth-optimism/op-app'
import { Badge, Text } from '@eth-optimism/ui-components'
import { Address, formatEther } from 'viem'
import { useAccount, useBalance } from 'wagmi'

type GameCellProps = {
  position: [number, number]
  value: 'X' | 'O' | 'empty'
  onMakeMove?: (x: number, y: number) => void
}

const GameCell = ({ value }: GameCellProps) => (
  <div
    className={cn(
      'flex content-center justify-center border-1 min-w-[120px] min-h-[120px] flex-wrap',
      value === 'empty' ? 'cursor-pointer' : '',
    )}
  >
    {value !== 'empty' && (
      <Text className="color-white text-3xl font-retro">{value}</Text>
    )}
  </div>
)

export const Game = () => {
  const { address, chainId } = useAccount()
  const { data: balance } = useBalance({ address, chainId })

  return (
    <div className="max-w-[960px] align-center justify-center">
      <Badge
        className="w-full cursor-default hover:bg-default"
        variant="default"
      >
        <Text className="w-full font-retro py-3 px-1 text-center">
          Waiting for player to join.
        </Text>
      </Badge>
      <div className="grid grid-rows-3 grid-cols-3 border-1 mt-6">
        <GameCell value="X" position={[0, 0]} />
        <GameCell value="X" position={[0, 1]} />
        <GameCell value="X" position={[0, 2]} />
        <GameCell value="empty" position={[1, 0]} />
        <GameCell value="X" position={[1, 1]} />
        <GameCell value="O" position={[1, 2]} />
        <GameCell value="X" position={[2, 0]} />
        <GameCell value="X" position={[2, 1]} />
        <GameCell value="X" position={[2, 2]} />
      </div>
      <div className="flex flex-col mt-3 text-center">
        <Text className="font-retro">
          Player: {shortenAddress(address as Address)}
        </Text>
        {balance && (
          <Text className="font-retro">
            Balance: {formatEther(balance?.value)}
          </Text>
        )}
      </div>
    </div>
  )
}
