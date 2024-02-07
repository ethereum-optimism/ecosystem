import { Tile, TileGrid } from '@/app/components/Tile/Tile'
import { Badge } from '@eth-optimism/ui-components/src/components/ui/badge'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'

const BuildSection = () => {
  return (
    <div className="mb-12">
      <Text as="h3" className="text-2xl font-semibold mb-4">
        Build
      </Text>
      <TileGrid>
        <Tile
          title="Superchain Faucet"
          description="Get test ETH tokens to build your dapp on the Superchain."
          onClick={() => {}}
        />
        <Tile
          title="Testnet Paymaster"
          description="Get your testnet transactions sponsored to remove friction from your dapp experience."
          onClick={() => {}}
        />
        <Tile
          title="UX Review"
          description="Get actionable feedback from Superchain pros to get your dapp ready for launch."
          onClick={() => {}}
          badge={<Badge variant="secondary">Featured</Badge>}
        />
        <Tile
          title="Superchain Safe"
          description="Get multisig support on any OP Chain in the Superchain."
          onClick={() => {}}
        />
      </TileGrid>
    </div>
  )
}

export { BuildSection }
