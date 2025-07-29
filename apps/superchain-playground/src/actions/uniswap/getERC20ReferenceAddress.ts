import { contracts } from '@eth-optimism/viem'
import {
  type AbiParameter,
  concat,
  encodeAbiParameters,
  getCreate2Address,
  zeroHash,
} from 'viem'

import { erc20RefBytecode } from '@/constants/erc20RefBytecode'
import type { Token } from '@/types/Token'

const erc20RefConstructorParameters: AbiParameter[] = [
  { name: 'homeChainId', type: 'uint256' },
  { name: 'erc20', type: 'address' },
  { name: 'remoteChainId', type: 'uint256' },
]

export const getRequiresReference = (token: Token, chainId: number) => {
  return !!token.nativeChainId && token.nativeChainId !== chainId
}

export const getERC20ReferenceInitCode = (
  token: Token,
  remoteChainId: number,
) => {
  const params = [token.nativeChainId, token.address, remoteChainId]
  const initData = encodeAbiParameters(erc20RefConstructorParameters, params)
  const initCode = concat([erc20RefBytecode, initData])
  return initCode
}

export const getERC20ReferenceAddress = (
  token: Token,
  remoteChainId: number,
) => {
  if (!token.nativeChainId) {
    throw Error(`Token ${token.address} has no native chain id`)
  }
  if (token.nativeChainId === remoteChainId) {
    throw Error(
      `Token ${token.address} marked as native on the remote chain ${remoteChainId}`,
    )
  }

  return getCreate2Address({
    bytecode: getERC20ReferenceInitCode(token, remoteChainId),
    from: contracts.create2Deployer.address,
    salt: zeroHash,
  })
}
