import './App.css'

import {
  Button,
  ToastAction,
  Toaster,
  useToast,
} from '@eth-optimism/ui-components'

function App() {
  const { toast } = useToast()

  return (
    <div>
      <Toaster />
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: 'Scheduled: Catch up ',
            description: 'Friday, February 10, 2023 at 5:57 PM',
            action: (
              <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            ),
          })
        }}
      >
        Add to calendar
      </Button>
    </div>
  )
}

export default App
