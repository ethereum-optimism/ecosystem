import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@eth-optimism/ui-components'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { InteropDialogContent } from '@/components/dialogs/InteropGameDialogContent'
import {
  TIC_TAC_TOE_CONTRACT_ADDRESS,
  ticTacToeABI,
} from '@/constants/contracts'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { supersimL2A, supersimL2B } from '@eth-optimism/viem'

const IGNORE_MATH_SYMBOLS = ['e', 'E', '+', '-']

export const JoinGameDialog = () => {
  const { address } = useAccount()
  const [gameId, setGameId] = useState<number | undefined>(undefined)
  const [step, setStep] = useState<'inputGameId' | 'executeFlow'>('inputGameId')
  const navigate = useNavigate()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full font-retro h-[120px]">
          Join Game
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center font-retro">
            Join Game
          </DialogTitle>
        </DialogHeader>

        {step === 'inputGameId' ? (
          <div className="flex flex-col pt-3 gap-3">
            <Input
              value={gameId}
              onKeyDown={(e) =>
                IGNORE_MATH_SYMBOLS.includes(e.key) && e.preventDefault()
              }
              onChange={(e) => setGameId(parseInt(e.target.value))}
              type="number"
            />

            <Button
              type="button"
              variant="default"
              className="font-retro"
              disabled={typeof gameId !== 'number'}
              onClick={() => setStep('executeFlow')}
            >
              Join
            </Button>

            <DialogClose asChild>
              <Button type="button" variant="secondary" className="font-retro">
                Cancel
              </Button>
            </DialogClose>
          </div>
        ) : (
          <InteropDialogContent
            abi={ticTacToeABI}
            functionName="joinGame"
            contractAddress={TIC_TAC_TOE_CONTRACT_ADDRESS}
            args={[address as Address, BigInt(gameId as number)]}
            originChain={supersimL2B}
            destinationChain={supersimL2A}
            onComplete={async () => navigate(`/tictactoe/${gameId}`)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
