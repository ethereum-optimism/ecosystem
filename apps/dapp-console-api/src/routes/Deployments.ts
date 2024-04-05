import type { Abi, Address } from 'viem'
import {
  createPublicClient,
  createWalletClient,
  encodeDeployData,
  http,
  isHex,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { anvil } from 'viem/chains'
import { z } from 'zod'

import { Trpc } from '..'
import { Route } from './Route'

const DEPLOY_SALT =
  '0x111122223333444455556666777788889999AAAABBBBCCCCDDDDEEEEFFFFCCCC'

const create2FactoryContractAddress =
  '0x5FbDB2315678afecb367f032d93F642f64180aa3'

const create2FactoryAbi = [
  {
    type: 'function',
    name: 'computeAddress',
    inputs: [
      {
        name: 'bytecode',
        type: 'bytes',
        internalType: 'bytes',
      },
      {
        name: 'salt',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'deploy',
    inputs: [
      {
        name: 'bytecode',
        type: 'bytes',
        internalType: 'bytes',
      },
      {
        name: 'salt',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'DeployedContract',
    inputs: [
      {
        name: 'addr',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
] as Abi

const deployer = createWalletClient({
  account: privateKeyToAccount(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  ), // anvil index: 0
  chain: anvil,
  transport: http(),
})

const anvilClient = createPublicClient({
  chain: anvil,
  transport: http(),
})

export class DeploymentRoute extends Route {
  public readonly name = 'deployments' as const

  public readonly triggerDeployment = 'triggerDeployment' as const
  public readonly triggerDeploymentController = this.trpc.procedure
    .input(
      z.object({
        bytecode: this.z.string().refine(isHex, {
          message: `Invalid bytecode hex`,
        }),
        abi: this.z.any(),
        version: this.z.string(),
        constructorArgs: this.z.any().array().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { abi, bytecode, constructorArgs } = input

      const data = encodeDeployData({
        abi,
        bytecode,
        args: constructorArgs ?? [],
      })

      const computedAddress = (await anvilClient.readContract({
        abi: create2FactoryAbi,
        address: create2FactoryContractAddress,
        functionName: 'computeAddress',
        args: [data, DEPLOY_SALT],
      })) as Address

      const code = await anvilClient.getBytecode({ address: computedAddress })
      if (code) {
        throw Trpc.handleStatus(
          400,
          `Contract with address ${computedAddress} already exists`,
        )
      }

      const deployTxHash = await deployer.writeContract({
        abi: create2FactoryAbi,
        address: create2FactoryContractAddress,
        functionName: 'deploy',
        args: [data, DEPLOY_SALT],
      })

      const receipt = await anvilClient.waitForTransactionReceipt({
        hash: deployTxHash,
      })

      return {
        receipt,
        deploymentHash: deployTxHash,
        address: computedAddress,
      }
    })

  public readonly handler = this.trpc.router({
    [this.triggerDeployment]: this.triggerDeploymentController,
  })
}
