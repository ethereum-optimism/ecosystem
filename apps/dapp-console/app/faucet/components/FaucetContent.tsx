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

import { isAddress } from 'viem'
import { FormEvent, useEffect, useState } from 'react'
import { getFormattedCountdown } from '@/app/utils'
import { Authentications } from '@/app/faucet/types'

type Props = {
  authentications: Authentications
}

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

const FaucetContent = ({ authentications }: Props) => {
  // Replace with real values from the backend
  const secondsToNextDrip = 10

  const hasAuthentication = Object.values(authentications).some(Boolean)
  const claimAmount = hasAuthentication ? 1 : 0.05
  const [address, setAddress] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState(
    faucetNetworks[0].label,
  )
  const [countdown, setCountdown] = useState(secondsToNextDrip)
  const [formattedTime, setFormattedTime] = useState('')

  const isClaimDisabled = !isValid || !selectedNetwork || countdown > 0
  const claimText =
    countdown > 0
      ? formattedTime
      : `Claim ${claimAmount} ETH on ${selectedNetwork}`

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown > 0 ? prevCountdown - 1 : 0,
      )
    }, 1000)

    setFormattedTime(`Claim again in ${getFormattedCountdown(countdown)}`)
    return () => clearInterval(interval)
  }, [countdown])

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
    setIsValid(isAddress(e.target.value))
  }

  const handleClaim = () => {
    console.log('Claiming ETH for address:', address)
    console.log('Selected Network:', selectedNetwork)
  }

  return (
    <div>
      <Label htmlFor="address">Address</Label>
      <div className="mb-6">
        <Input
          className="mt-4 mb-2"
          id="address"
          type="text"
          placeholder="Enter ETH address"
          value={address}
          onChange={handleAddressChange}
        />

        {address.length > 0 && !isValid && (
          <Text className="text-red-500">Please enter a valid ETH address</Text>
        )}
      </div>

      <Label>Network</Label>
      <RadioGroup
        className="mt-4 mb-6 grid grid-cols-2"
        value={selectedNetwork}
      >
        {faucetNetworks.map((network) => (
          <RadioCard
            key={network.chainID}
            value={network.label}
            onClick={() => {
              setSelectedNetwork(network.label)
            }}
          >
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
      <Button
        disabled={isClaimDisabled}
        className="w-full"
        onClick={handleClaim}
      >
        {claimText}
      </Button>
    </div>
  )
}

export { FaucetContent }
