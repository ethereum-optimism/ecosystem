import { Label } from '@eth-optimism/ui-components/src/components/ui/label/label'
import { Input } from '@eth-optimism/ui-components/src/components/ui/input/input'
import { RadioCard } from '@eth-optimism/ui-components/src/components/ui/radio-group/radio-card'
import { RadioGroup } from '@eth-optimism/ui-components/src/components/ui/radio-group/radio-group'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import {
  baseSepolia,
  modeTestnet,
  optimismSepolia,
  sepolia,
  zoraSepolia,
} from 'viem/chains'

const faucetNetworks = [
  {
    label: 'Base Sepolia',
    image: '/logos/base-logo.png',
    chainID: baseSepolia.id,
  },
  {
    label: 'Ethereum Sepolia',
    image: '/logos/eth-logo.png',
    chainID: sepolia.id,
  },
  {
    label: 'Fraxtal Sepolia',
    image: '/logos/frax-logo.png',
    chainID: 2523,
  },
  {
    label: 'Lisk Sepolia',
    image: '/logos/lisk-logo.png',
    chainID: 4202,
  },
  {
    label: 'Mode Sepolia',
    image: '/logos/mode-logo.png',
    chainID: modeTestnet.id,
  },
  {
    label: 'OP Sepolia',
    image: '/logos/op-logo.svg',
    chainID: optimismSepolia.id,
  },
  {
    label: 'Zora Sepolia',
    image: '/logos/zora-logo.png',
    chainID: zoraSepolia.id,
  },
]

const FaucetContent = () => {
  return (
    <div>
      <Label htmlFor="address">Address</Label>
      <Input
        className="mt-4 mb-6"
        id="address"
        type="text"
        placeholder="Enter ETH address"
      />

      <Label>Network</Label>
      <RadioGroup className="mt-4 mb-6 grid grid-cols-2">
        {faucetNetworks.map((network) => (
          <RadioCard key={network.chainID} value={network.chainID.toString()}>
            <div className="flex gap-3 items-center">
              <img
                src={network.image}
                alt={network.label}
                className="w-10 h-10 rounded-full"
              />
              <Text as="span" className="text-base font-semibold">
                {network.label}
              </Text>
            </div>
          </RadioCard>
        ))}
      </RadioGroup>
      <Button className="w-full">Claim</Button>
    </div>
  )
}

export { FaucetContent }
