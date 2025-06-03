import { contracts } from '@eth-optimism/viem'
import {
  type AbiParameter,
  type Address,
  encodeAbiParameters,
  encodePacked,
  getCreate2Address,
  zeroHash,
} from 'viem'

import { erc20RefBytecode } from '@/constants/erc20RefBytecode'
import type { Token } from '@/types/Token'

const erc20RefConstructorParameters: AbiParameter[] = [
  { name: 'homeChainId', type: 'uint256' },
  { name: 'erc20', type: 'address' },
  { name: 'remoteChainId', type: 'uint256' },
  { name: 'spender', type: 'address' },
]

export const getReferenceAddress = (
  token: Token,
  remoteChainId: number,
  spender: Address,
) => {
  if (!token.nativeChainId) {
    throw Error(`Token ${token.address} has no native chain id`)
  }
  if (token.nativeChainId === remoteChainId) {
    throw Error(
      `Token ${token.address} marked as native on the remote chain ${remoteChainId}`,
    )
  }

  const constructorData = encodeAbiParameters(erc20RefConstructorParameters, [
    token.nativeChainId,
    token.address,
    remoteChainId,
    spender,
  ])

  const initCode = encodePacked(
    ['bytes', 'bytes'],
    [erc20RefBytecode, constructorData],
  )

  return getCreate2Address({
    bytecode: initCode,
    from: contracts.create2Deployer.address,
    salt: zeroHash,
  })
}
