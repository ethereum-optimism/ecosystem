import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@eth-optimism/ui-components'
import { useNavigate } from 'react-router'

export const CreateGameDialog = () => {
  const navigate = useNavigate()

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

        <div className="flex flex-col pt-3 gap-3">
          <Button
            type="button"
            variant="default"
            className="font-retro"
            onClick={() => navigate('/tictactoe/123')}
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
