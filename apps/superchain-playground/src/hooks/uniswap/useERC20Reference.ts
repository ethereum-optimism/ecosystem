import { contracts, create2DeployerAbi } from '@eth-optimism/viem'
import { switchChain } from '@wagmi/core'
import { type Chain, zeroHash } from 'viem'
import {
  useBytecode,
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import {
  getERC20ReferenceAddress,
  getERC20ReferenceInitCode,
  getRequiresReference,
} from '@/actions/uniswap/getERC20ReferenceAddress'
import type { Token } from '@/types/Token'

export const useERC20Reference = ({
  token,
  chain,
}: {
  token: Token
  chain: Chain
}) => {
  const config = useConfig()

  const {
    data: localHash,
    writeContractAsync: writeContractAsyncLocal,
    isPending: isPendingLocal,
  } = useWriteContract()

  const {
    data: remoteHash,
    writeContractAsync: writeContractAsyncRemote,
    isPending: isPendingRemote,
  } = useWriteContract()

  const { isLoading: isConfirmingLocal } = useWaitForTransactionReceipt({
    hash: localHash,
  })
  const { isLoading: isConfirmingRemote } = useWaitForTransactionReceipt({
    hash: remoteHash,
  })

  const requiresReference = getRequiresReference(token, chain.id)

  const referenceAddress = requiresReference
    ? getERC20ReferenceAddress(token, chain.id)
    : undefined

  const { data: localCode, isLoading: isLoadingLocalReference } = useBytecode({
    address: referenceAddress,
    chainId: chain.id,
    query: { enabled: !!referenceAddress, refetchInterval: 200 },
  })

  const { data: remoteCode, isLoading: isLoadingRemoteReference } = useBytecode(
    {
      address: referenceAddress,
      chainId: token.nativeChainId,
      query: { enabled: !!token.nativeChainId, refetchInterval: 200 },
    },
  )

  const localReferenceDeployed = localCode && localCode.length > 2
  const remoteReferenceDeployed = remoteCode && remoteCode.length > 2

  const initializeReference = async () => {
    if (!requiresReference) return
    if (isLoadingLocalReference || isLoadingRemoteReference) return

    console.log(`CREATING ERC20 REFERENCE: (${token.address},${chain.id})`)

    const initCode = getERC20ReferenceInitCode(token, chain.id)

    // Deploy Reference on the Local Chain
    try {
      if (!localReferenceDeployed) {
        await switchChain(config, { chainId: chain.id })
        await writeContractAsyncLocal({
          address: contracts.create2Deployer.address,
          abi: create2DeployerAbi,
          functionName: 'deploy',
          args: [0n, zeroHash, initCode],
        })
      }

      // Deploy Reference on the Remote Chain
      if (!remoteReferenceDeployed) {
        await switchChain(config, { chainId: token.nativeChainId! })
        await writeContractAsyncRemote({
          address: contracts.create2Deployer.address,
          abi: create2DeployerAbi,
          functionName: 'deploy',
          args: [0n, zeroHash, initCode],
        })
      }

      await switchChain(config, { chainId: chain.id })
    } catch (error) {
      console.error(`ERROR INITIALIZING ERC20 REFERENCES: ${error}`)
    }
  }

  return {
    requiresReference:
      requiresReference &&
      (!localReferenceDeployed || !remoteReferenceDeployed),
    initializeReference,
    isPending:
      isPendingLocal ||
      isPendingRemote ||
      isConfirmingLocal ||
      isConfirmingRemote,
  }
}
