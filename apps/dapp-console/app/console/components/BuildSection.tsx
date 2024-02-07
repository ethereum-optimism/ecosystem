import { Tile } from '@/app/components/Tile/Tile'
import { Badge } from '@eth-optimism/ui-components/src/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@eth-optimism/ui-components/src/components/ui/card'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'

const BuildSection = () => {
  const card = (
    <Card className="cursor-pointer shadow-sm hover:shadow">
      <CardHeader className="pb-1">
        <Text as="span" className="text-base font-semibold">
          Build
        </Text>
      </CardHeader>
      <CardContent>
        <Text as="p" className="text-muted-foreground">
          Deploy your smart contracts to L2 and start scaling your dApp.
        </Text>
      </CardContent>
      <CardFooter>
        <Badge variant="secondary">Featured</Badge>
      </CardFooter>
    </Card>
  )
  return (
    <div>
      <Text as="h3" className="text-2xl font-semibold mb-4">
        Build
      </Text>

      <div className="grid grid-cols-3 gap-6 mb-12">
        <Tile
          title="Test"
          description="Test"
          onClick={() => {}}
          badge={<Badge variant="secondary">Featured</Badge>}
        />

        {card}
        {card}
        {card}
      </div>
    </div>
  )
}

export { BuildSection }
