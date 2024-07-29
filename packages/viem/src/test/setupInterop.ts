import { encodePacked, keccak256, toHex } from 'viem'
import { base } from 'viem/chains'

import { contracts } from '@/contracts.js'
import { testClient } from '@/test/clients.js'

export async function configureDependencySet() {
  // adds base as part of the dep set
  const depedencySetSlot = BigInt(8)
  const _valuesSlot = keccak256(encodePacked(['uint256'], [depedencySetSlot]))
  const _positionsSlot = keccak256(
    encodePacked(
      ['uint256', 'uint256'],
      [BigInt(base.id), depedencySetSlot + 1n],
    ),
  )

  await testClient.setStorageAt({
    address: contracts.l1BlockInterop.address,
    index: _valuesSlot,
    value: toHex(base.id, { size: 32 }),
  })

  await testClient.setStorageAt({
    address: contracts.l1BlockInterop.address,
    index: _positionsSlot,
    value: toHex(1n, { size: 32 }),
  })
}
