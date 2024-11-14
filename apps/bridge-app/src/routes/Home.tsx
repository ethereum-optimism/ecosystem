import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components'
import { useNavigate } from 'react-router'

export const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-row flex-wrap gap-3">
      <Card className="cursor-pointer" onClick={() => navigate('/playground')}>
        <CardHeader>
          <CardTitle>Wagmi & Viem Playground</CardTitle>
          <CardDescription>Playground to test out Wagmi & Viem</CardDescription>
        </CardHeader>
      </Card>

      <Card className="cursor-pointer" onClick={() => navigate('/bridge')}>
        <CardHeader>
          <CardTitle>Bridge</CardTitle>
          <CardDescription>Example Bridge Implementation</CardDescription>
        </CardHeader>
      </Card>

      <Card className="cursor-pointer" onClick={() => navigate('/tictactoe')}>
        <CardHeader>
          <CardTitle>Tic Tac Toe</CardTitle>
          <CardDescription>Example Interop Implementation</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
