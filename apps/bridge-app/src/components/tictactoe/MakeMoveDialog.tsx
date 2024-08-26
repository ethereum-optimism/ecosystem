import {
  TIC_TAC_TOE_CONTRACT_ADDRESS,
  ticTacToeABI,
} from '@/constants/contracts'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@eth-optimism/ui-components'
import { supersimL2A, supersimL2B } from '@eth-optimism/viem'
import { useAccount } from 'wagmi'
import { InteropDialogContent } from '@/components/dialogs/InteropGameDialogContent'
import { Address } from 'viem'

export type MakeMoveDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  gameId: number
  position?: [number, number]
  onComplete: () => void
}

export const MakeMoveDialog = ({
  isOpen,
  gameId,
  position,
  onComplete,
  onOpenChange,
}: MakeMoveDialogProps) => {
  const { address } = useAccount()

  if (!position) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center font-retro">
            Move Move ({position[0]}, {position[1]})
          </DialogTitle>
        </DialogHeader>

        <InteropDialogContent
          abi={ticTacToeABI}
          functionName="makeMove"
          originChain={supersimL2B}
          destinationChain={supersimL2A}
          contractAddress={TIC_TAC_TOE_CONTRACT_ADDRESS}
          args={[address as Address, BigInt(gameId), position[0], position[1]]}
          onComplete={async () => {
            onOpenChange(false)
            onComplete?.()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
