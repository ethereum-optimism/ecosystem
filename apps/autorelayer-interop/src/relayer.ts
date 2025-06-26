import { contracts } from '@eth-optimism/viem'
import { gasTankAbi } from '@eth-optimism/viem/abis/experimental'
import {
  relayCrossDomainMessage,
  simulateRelayCrossDomainMessage,
} from '@eth-optimism/viem/actions/interop'
import type { MessageIdentifier } from '@eth-optimism/viem/types/interop'
import { encodeAccessList } from '@eth-optimism/viem/utils/interop'
import type { Logger } from 'pino'
import type {
  AccessList,
  Account,
  Address,
  Chain,
  Client,
  Hex,
  PublicClient,
  WalletClient,
} from 'viem'
import { isAddress, isHash, isHex } from 'viem'
import { simulateContract, writeContract } from 'viem/actions'
import { z } from 'zod'

import { jsonFetchParams } from '@/utils/jsonFetchParams.js'

export const PendingMessageSchema = z.object({
  // Identifier
  messageHash: z.string().refine(isHex, 'invalid message hash'),
  // Message Direction
  source: z.number(),
  destination: z.number(),
  target: z.string().refine(isAddress, 'invalid target'),
  txOrigin: z.string().refine(isAddress, 'invalid transaction origin'),
  // ExecutingMessage
  logIndex: z.number(),
  logPayload: z.string().refine(isHex, 'invalid log payload'),
  timestamp: z.number(),
  blockNumber: z.number(),
  transactionHash: z.string().refine(isHash, 'invalid transaction hash'),
})

export const PendingMessagesSchema = z.array(PendingMessageSchema)

export type PendingMessage = z.infer<typeof PendingMessageSchema>

export type PendingMessages = z.infer<typeof PendingMessagesSchema>

export const PendingMessageWithGasTankSchema = PendingMessageSchema.extend({
  gasTankProviders: z.array(
    z.object({
      gasTankChainId: z.number(),
      gasProviderBalance: z.number(),
      gasProviderAddress: z
        .string()
        .refine(isAddress, 'invalid gas provider address'),
    }),
  ),
})

export const PendingMessagesWithGasTankSchema = z.array(
  PendingMessageWithGasTankSchema,
)

export type PendingMessageWithGasTank = z.infer<
  typeof PendingMessageWithGasTankSchema
>

export type PendingMessagesWithGasTank = z.infer<
  typeof PendingMessagesWithGasTankSchema
>

export interface RelayerConfig {
  ponderInteropApi: string
  clients: Record<number, PublicClient>
  walletClients: Record<number, WalletClient>
  gasTankAddress?: Address
}

export interface RelayMessageParams {
  id: MessageIdentifier
  payload: Hex
  account: Account
  accessList: AccessList
  chain: Chain | null
}

const GAS_BUFFER = 125n

export class Relayer {
  protected readonly log: Logger
  private readonly config: RelayerConfig

  constructor(log: Logger, config: RelayerConfig) {
    this.config = config
    this.log = log.child({ module: 'relayer' })
  }

  async run(): Promise<void> {
    const pendingMessages = await this.fetchPendingMessages()
    this.log.info(`${pendingMessages.length} pending messages`)

    for (const message of pendingMessages) {
      const msgLog = this.log.child({
        source: message.source,
        destination: message.destination,
        messageHash: message.messageHash,
        txHash: message.transactionHash,
      })

      if (
        !this.config.clients[message.destination] ||
        !this.config.walletClients[message.destination]
      ) {
        msgLog.warn('no client for destination, skipping...')
        continue
      }

      const client = this.config.clients[message.destination]
      const walletClient = this.config.walletClients[message.destination]

      // If no account is configured (sponsored), specify
      // a random account owned by the sponsored endpoint.
      let account = walletClient.account
      if (!account) {
        const accounts = await walletClient.getAddresses()
        if (accounts.length === 0) {
          msgLog.warn('no accounts found, skipping...')
          continue
        }

        const randomIndex = Math.floor(Math.random() * accounts.length)
        account = { address: accounts[randomIndex], type: 'json-rpc' }
      }

      try {
        await this.validate(message)
      } catch (error) {
        msgLog.warn(
          { err: error },
          `validation failed, skipping message ${message.messageHash}`,
        )
        continue
      }

      // build the executing message params
      const id: MessageIdentifier = {
        origin: contracts.l2ToL2CrossDomainMessenger.address,
        chainId: BigInt(message.source),
        logIndex: BigInt(message.logIndex),
        blockNumber: BigInt(message.blockNumber),
        timestamp: BigInt(message.timestamp),
      }
      const payload = message.logPayload
      const accessList = encodeAccessList(id, payload)

      const params = { id, payload, accessList, account, chain: null }

      try {
        const relayTxHash = this.config.gasTankAddress
          ? await this.relayMessageViaGasTank({
              publicClient: client,
              walletClient,
              gasTankAddress: this.config.gasTankAddress,
              params,
              msgLog,
              message: message as PendingMessageWithGasTank,
            })
          : await this.relayMessageViaL2ToL2CrossDomainMessenger({
              publicClient: client,
              walletClient,
              params,
              msgLog,
            })
        msgLog.info({ relayTxHash }, 'submitted message relay')
      } catch (error) {
        msgLog.warn('relay failed, skipping...')
        continue
      }
    }
  }

  /**
   * Validates a pending message
   * @param message - The message to validate
   * @throws Error if validation fails
   */
  protected async validate(_message: PendingMessage): Promise<void> {}

  /**
   * Fetches pending messages to be relayed
   * @returns An array of pending messages
   * @throws Error if the pending messages fetch fails
   */
  protected async fetchPendingMessages(): Promise<
    PendingMessages | PendingMessagesWithGasTank
  > {
    try {
      if (this.config.gasTankAddress) {
        return await this.fetchPendingMessagesWithGasTankFunds()
      }

      return await this.fetchAllPendingMessages()
    } catch (error) {
      throw new Error(`failed pending messages fetch: ${error}`)
    }
  }

  private async fetchAllPendingMessages(): Promise<PendingMessages> {
    const url = `${this.config.ponderInteropApi}/messages/pending`
    const resp = await fetch(url, jsonFetchParams)
    if (!resp.ok) {
      throw new Error(`http response: ${resp.statusText}`)
    }

    const body = await resp.json()
    const { data: msgs, error } = PendingMessagesSchema.safeParse(body)
    if (error) {
      throw new Error(
        `api response: ${error.errors
          .map((e) => `{${e.path.join('.')}: ${e.message}}`)
          .join(', ')}`,
      )
    }

    return msgs
  }

  private async fetchPendingMessagesWithGasTankFunds(): Promise<PendingMessagesWithGasTank> {
    const url = `${this.config.ponderInteropApi}/messages/pending/gas-tank`
    const resp = await fetch(url, jsonFetchParams)
    if (!resp.ok) {
      throw new Error(`http response: ${resp.statusText}`)
    }

    const body = await resp.json()
    const { data: msgs, error } =
      PendingMessagesWithGasTankSchema.safeParse(body)
    if (error) {
      throw new Error(
        `api response: ${error.errors
          .map((e) => `{${e.path.join('.')}: ${e.message}}`)
          .join(', ')}`,
      )
    }
    return msgs
  }

  private async relayMessageViaL2ToL2CrossDomainMessenger({
    publicClient,
    walletClient,
    params,
    msgLog,
  }: {
    publicClient: PublicClient
    walletClient: Client
    params: RelayMessageParams
    msgLog: Logger
  }): Promise<Hex> {
    try {
      await simulateRelayCrossDomainMessage(publicClient, params)
    } catch (error) {
      msgLog.warn({ err: error }, 'relay failed simulation')
      throw error
    }

    // submit (skip local gas estimation if sponsored)
    const gas = !walletClient.account ? null : undefined
    try {
      return relayCrossDomainMessage(walletClient, {
        ...params,
        gas,
      })
    } catch (error) {
      msgLog.warn({ err: error }, 'relay failed')
      throw error
    }
  }

  private async relayMessageViaGasTank({
    publicClient,
    walletClient,
    gasTankAddress,
    params,
    msgLog,
    message,
  }: {
    publicClient: PublicClient
    walletClient: WalletClient
    gasTankAddress: Address
    params: RelayMessageParams
    msgLog: Logger
    message: PendingMessageWithGasTank
  }): Promise<Hex> {
    const { id, payload, account, accessList, chain } = params
    const contractArgs = {
      address: gasTankAddress,
      abi: gasTankAbi,
      functionName: 'relayMessage',
      args: [id, payload],
      account,
      accessList,
    } as const
    const block = await publicClient.getBlock()

    const [simulatedRelayGasCost, simulatedNestedMessages] = (
      await simulateContract(publicClient, {
        ...contractArgs,
        blockNumber: block.number,
      }).catch((error) => {
        msgLog.warn({ err: error }, 'relay failed simulation')
        throw error
      })
    ).result

    const baseFee = block.baseFeePerGas || 0n
    const estimatedClaimGasCost = await publicClient.readContract({
      address: gasTankAddress,
      abi: gasTankAbi,
      functionName: 'claimOverhead',
      args: [BigInt(simulatedNestedMessages.length), baseFee],
    })
    // Add a buffer to the simulated gas cost to account for base fee increases.
    const totalGasCost =
      ((simulatedRelayGasCost + estimatedClaimGasCost) * GAS_BUFFER) / 100n
    const hasEnoughFunds = message.gasTankProviders.some(
      (provider) => provider.gasProviderBalance >= totalGasCost,
    )
    if (!hasEnoughFunds) {
      msgLog.warn(
        {
          message,
          estimatedClaimGasCost,
          simulatedRelayGasCost,
          totalGasCost,
        },
        'gas tank has insufficient funds',
      )
      throw new Error('gas tank has insufficient funds')
    }

    try {
      return await writeContract(walletClient, {
        ...contractArgs,
        chain,
      })
      // TODO: when configuring monitoring add a check that verifies the accuracy of the gas estimate and the
      // actual gas cost of the relay transaction.
    } catch (error) {
      msgLog.warn({ err: error }, 'relay failed')
      throw error
    }
  }
}
