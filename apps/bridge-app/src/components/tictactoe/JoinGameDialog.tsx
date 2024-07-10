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

const IGNORE_MATH_SYMBOLS = ['e', 'E', '+', '-']

export const JoinGameDialog = () => {
  const [gameId, setGameId] = useState<number | undefined>(undefined)
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
            onClick={() => navigate(`/tictactoe/${gameId}`)}
          >
            Join
          </Button>

          <DialogClose asChild>
            <Button type="button" variant="secondary" className="font-retro">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
