import type { PrivateKeyAccount, PublicClient, WalletClient } from 'viem'

import {
  adminFaucetAuthModuleAbi,
  adminFaucetAuthModuleByteCode,
} from '../abi/AdminFaucetAuthModule'
import { faucetAbi, faucetByteCode } from '../abi/Faucet'

export const deployFaucetContract = async (
  publicClient: PublicClient,
  walletClient: WalletClient,
  account: PrivateKeyAccount,
) => {
  const faucetDeploymentHash = await walletClient.deployContract({
    abi: faucetAbi,
    bytecode: faucetByteCode,
    account,
    chain: walletClient.chain,
    args: [account.address],
  })

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: faucetDeploymentHash,
  })

  return receipt.contractAddress!
}

export const deployOnChainFamContract = async (
  publicClient: PublicClient,
  walletClient: WalletClient,
  account: PrivateKeyAccount,
) => {
  const famDeploymentHash = await walletClient.deployContract({
    abi: adminFaucetAuthModuleAbi,
    bytecode: adminFaucetAuthModuleByteCode,
    account,
    chain: walletClient.chain,
    args: [account.address, 'OnChainAuthModule', '1'],
  })

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: famDeploymentHash,
  })

  return receipt.contractAddress!
}

export const deployOffChainFamContract = async (
  publicClient: PublicClient,
  walletClient: WalletClient,
  account: PrivateKeyAccount,
) => {
  const famDeploymentHash = await walletClient.deployContract({
    abi: adminFaucetAuthModuleAbi,
    bytecode: adminFaucetAuthModuleByteCode,
    account,
    chain: walletClient.chain,
    args: [account.address, 'OffChainAuthModule', '1'],
  })

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: famDeploymentHash,
  })

  return receipt.contractAddress!
}
