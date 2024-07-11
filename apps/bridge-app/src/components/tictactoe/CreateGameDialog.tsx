import { useCreateGame } from '@/hooks/tictactoe/useCreateGame'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Text,
} from '@eth-optimism/ui-components'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'

export const CreateGameDialog = () => {
  const navigate = useNavigate()
  const { createGame, isPending } = useCreateGame()

  const handleCreateGame = useCallback(async () => {
    const { gameId } = await createGame()

    if (gameId) {
      navigate(`/tictactoe/${gameId}`)
    }
  }, [navigate])

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

        {isPending && (
          <Text className="font-retro text-sm text-center color-secondary">
            Waiting for game to be created.
          </Text>
        )}

        <div className="flex flex-col pt-3 gap-3">
          <Button
            type="button"
            variant="default"
            className="font-retro"
            disabled={isPending}
            onClick={handleCreateGame}
          >
            Continue
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
