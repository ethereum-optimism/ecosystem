import { Badge } from '@eth-optimism/ui-components/src/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@eth-optimism/ui-components/src/components/ui/card'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'

type TileProps = {
  title: string
  description: string
  badge?: React.ReactNode
  onClick: () => void
}
const Tile = ({ title, description, badge, onClick }: TileProps) => {
  return (
    <Card className="cursor-pointer flex flex-col justify-between	 shadow-sm hover:shadow">
      <div>
        <CardHeader className="pb-1">
          <Text as="span" className="text-base font-semibold">
            {title}
          </Text>
        </CardHeader>
        <CardContent>
          <Text as="p" className="text-muted-foreground">
            {description}
          </Text>
        </CardContent>
      </div>
      <CardFooter className="" style={{ justifySelf: 'flex-end' }}>
        <span>{badge}</span>
      </CardFooter>
    </Card>
  )
}

export { Tile }
