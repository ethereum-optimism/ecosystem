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
    <Card
      className="cursor-pointer flex flex-col shadow-sm hover:shadow"
      onClick={onClick}
    >
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
      <CardFooter className="mt-auto">
        <span>{badge}</span>
      </CardFooter>
    </Card>
  )
}

const TileGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 gap-6 auto-rows-[205px] lg:grid-cols-3 md:grid-cols-2">
      {children}
    </div>
  )
}

export { Tile, TileGrid }
