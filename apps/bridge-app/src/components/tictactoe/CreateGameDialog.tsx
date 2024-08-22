import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@eth-optimism/ui-components'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { InteropDialogContent } from '@/components/dialogs/InteropGameDialogContent'
import { supersimL2A, supersimL2B } from '@eth-optimism/viem'
import { Address } from 'viem'
import {
  TIC_TAC_TOE_CONTRACT_ADDRESS,
  ticTacToeABI,
} from '@/constants/contracts'
import { useAccount } from 'wagmi'
import { getGameId } from '@/utils/gameClient'
import { InteropTransactionData } from '@/hooks/useInterop'

export const CreateGameDialog = () => {
  const navigate = useNavigate()
  const { address } = useAccount()

  const handleCreateGame = useCallback(
    async (transactionData: InteropTransactionData) => {
      const gameId = await getGameId(transactionData.executeMessageHash)

      if (gameId) {
        navigate(`/tictactoe/${gameId}`)
      }
    },
    [navigate],
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full font-retro h-[120px]">
          Create Game
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center font-retro">
            Create Game
          </DialogTitle>
        </DialogHeader>

        <InteropDialogContent
          abi={ticTacToeABI}
          functionName="createGame"
          originChain={supersimL2B}
          destinationChain={supersimL2A}
          contractAddress={TIC_TAC_TOE_CONTRACT_ADDRESS}
          args={[address as Address]}
          onComplete={handleCreateGame}
        />
      </DialogContent>
    </Dialog>
  )
}
