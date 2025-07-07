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
import { readContract, simulateContract, writeContract } from 'viem/actions'
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

const gasTankProviderSchema = z.object({
  gasTankChainId: z.number(),
  gasProviderBalance: z.number(),
  gasProviderAddress: z
    .string()
    .refine(isAddress, 'invalid gas provider address'),
  pendingWithdrawal: z
    .object({
      amount: z.number(),
      initiatedAt: z.number(),
    })
    .optional(),
})

type GasTankProvider = z.infer<typeof gasTankProviderSchema>

export const PendingMessageWithGasTankSchema = PendingMessageSchema.extend({
  gasTankProviders: z.array(gasTankProviderSchema),
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

export const PendingClaimSchema = z.object({
  relayReceipt: z.object({
    messageHash: z.string().refine(isHex, 'invalid message hash'),
    origin: z.string().refine(isAddress, 'invalid origin'),
    blockNumber: z.number(),
    logIndex: z.number(),
    timestamp: z.number(),
    chainId: z.number(),
    logPayload: z.string().refine(isHex, 'invalid log payload'),
    gasProvider: z.string().refine(isAddress, 'invalid gas provider'),
    gasProviderChainId: z.number(),
    relayer: z.string().refine(isAddress, 'invalid relayer'),
    relayCost: z.number(),
    relayedAt: z.number(),
    nestedMessageHashes: z.array(
      z.string().refine(isHex, 'invalid nested message hash'),
    ),
  }),
})

export const PendingClaimsSchema = z.array(PendingClaimSchema)

export type PendingClaim = z.infer<typeof PendingClaimSchema>

export type PendingClaims = z.infer<typeof PendingClaimsSchema>

const PendingRelayCostForGasProviderSchema = z
  .object({
    gasProviderAddress: z
      .string()
      .refine(isAddress, 'invalid gas provider address'),
    gasProviderChainId: z.number(),
    totalPendingRelayCost: z.coerce.number(),
    pendingReceiptsCount: z.number(),
  })
  .nullable()

type PendingRelayCostForGasProvider = z.infer<
  typeof PendingRelayCostForGasProviderSchema
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
    // Run both operations in parallel since they're independent. If this starts to become a
    // bottleneck, we should consider separating pending message relaying and pending claim
    // processing into separate services.
    await Promise.allSettled([
      this.relayPendingMessages(),
      this.config.gasTankAddress
        ? this.processPendingClaims()
        : Promise.resolve(),
    ])
  }

  /**
   * Validates a pending message
   * @param message - The message to validate
   * @throws Error if validation fails
   */
  protected async validate(_message: PendingMessage): Promise<void> {}

  /**
   * Relays pending messages
   * @returns void
   */
  private async relayPendingMessages() {
    if (this.config.gasTankAddress) {
      const pendingMessages =
        await this.fetchPendingMessagesWithGasTankFunds().catch((error) => {
          this.log.error(
            { err: error },
            'failed to fetch pending messages with gas tank funds',
          )
          throw error
        })
      this.log.info(`${pendingMessages.length} pending messages`)
      return this.relayMessagesViaGasTank(pendingMessages).catch((error) => {
        this.log.error({ err: error }, 'failed to relay gas tank messages')
        throw error
      })
    }

    const pendingMessages = await this.fetchAllPendingMessages().catch(
      (error) => {
        this.log.error({ err: error }, 'failed to fetch pending messages')
        throw error
      },
    )
    this.log.info(`${pendingMessages.length} pending messages`)
    return this.relayMessagesViaL2ToL2CrossDomainMessenger(
      pendingMessages,
    ).catch((error) => {
      this.log.error({ err: error }, 'failed to relay messages')
      throw error
    })
  }

  /**
   * Relays messages via the L2ToL2CrossDomainMessenger contract
   * @param messages - The messages to relay
   * @returns void
   */
  private async relayMessagesViaL2ToL2CrossDomainMessenger(
    messages: PendingMessage[],
  ): Promise<void> {
    // Process all messages in parallel
    await Promise.allSettled(
      messages.map(async (message) => {
        const msgLog = this.log.child({
          action: 'relayMessageViaL2ToL2CrossDomainMessenger',
          source: message.source,
          destination: message.destination,
          messageHash: message.messageHash,
          txHash: message.transactionHash,
        })

        const prepared = await this.validateAndPrepareMessage(
          message,
          msgLog,
        ).catch((error) => {
          msgLog.error({ err: error }, 'failed to validate and prepare message')
        })
        if (!prepared) {
          msgLog.warn('invalid message, skipping...')
          return
        }
        const { params, clientsAndAccount } = prepared
        const { client, walletClient } = clientsAndAccount
        this.relayMessageViaL2ToL2CrossDomainMessenger({
          client,
          walletClient,
          params,
          msgLog,
        }).catch((error) => {
          msgLog.warn(
            { err: error },
            'L2ToL2CrossDomainMessenger message relay failed, skipping...',
          )
        })
      }),
    )
  }

  /**
   * Relays messages via the GasTank contract
   * @param messages - The messages to relay
   * @returns void
   */
  private async relayMessagesViaGasTank(messages: PendingMessageWithGasTank[]) {
    const gasTankProviderToMessages =
      await this.groupPendingMessagesByGasTankProvider(messages)

    // relay messages across all gas tank providers in parallel and relay messages within each gas provider in series
    return Promise.allSettled(
      Array.from(gasTankProviderToMessages.entries()).map(
        async ([gasTankProvider, { messages }]) => {
          for (const message of messages) {
            const msgLog = this.log.child({
              action: 'relayMessageViaGasTank',
              source: message.source,
              destination: message.destination,
              messageHash: message.messageHash,
              txHash: message.transactionHash,
              gasTankProvider: gasTankProvider.gasProviderAddress,
              gasTankProviderChainId: gasTankProvider.gasTankChainId,
            })

            const prepared = await this.validateAndPrepareMessage(
              message,
              msgLog,
            ).catch((error) => {
              msgLog.error(
                { err: error },
                'failed to validate and prepare message',
              )
            })
            if (!prepared) {
              msgLog.warn('invalid message, skipping...')
              continue
            }
            const { params, clientsAndAccount } = prepared
            const { client, walletClient } = clientsAndAccount
            try {
              const relayTxHash = await this.relayMessageViaGasTank({
                client,
                walletClient,
                gasTankAddress: this.config.gasTankAddress!,
                params,
                msgLog,
                message,
                gasTankProvider,
              })
              msgLog.info({ relayTxHash }, 'submitted gas tank message relay')
            } catch (error) {
              msgLog.warn({ err: error }, 'gas tank relay failed, skipping...')
            }
          }
        },
      ),
    )
  }

  /**
   * Groups pending messages by gas tank provider with the most funds
   * @param messages - The pending messages to group
   * @returns A mapping of gas tank provider to pending messages
   */
  private async groupPendingMessagesByGasTankProvider(
    messages: PendingMessageWithGasTank[],
  ): Promise<Map<GasTankProvider, { messages: PendingMessageWithGasTank[] }>> {
    // Cache balance calculations to avoid repeated calls
    const balanceCache = new Map<GasTankProvider, number>()

    /**
     * Gets the cached balance for a gas tank provider
     * @param provider - The gas tank provider
     * @returns The cached balance
     */
    const getCachedBalance = async (
      provider: GasTankProvider,
    ): Promise<number> => {
      if (!balanceCache.has(provider)) {
        balanceCache.set(
          provider,
          await this.getGasProviderBalance(provider).catch((error) => {
            this.log.error(
              { err: error },
              `failed to get gas provider balance ${provider.gasProviderAddress}`,
            )
            throw error
          }),
        )
      }
      return balanceCache.get(provider)!
    }

    const result = new Map<
      GasTankProvider,
      { messages: PendingMessageWithGasTank[] }
    >()

    for (const message of messages) {
      let bestGasProvider = message.gasTankProviders[0]

      // Find the gas provider with highest balance for this message
      for (const provider of message.gasTankProviders) {
        const balance = await getCachedBalance(provider)
        if (balance > bestGasProvider.gasProviderBalance) {
          bestGasProvider = provider
        }
      }

      if (!result.has(bestGasProvider)) {
        result.set(bestGasProvider, {
          messages: [],
        })
      }
      result.get(bestGasProvider)!.messages.push(message)
    }
    return result
  }

  /**
   * Validates and prepares message for relaying
   * @param message - The message to validate and prepare
   * @param msgLog - The logger
   * @returns Prepared message params or null if validation fails
   */
  private async validateAndPrepareMessage(
    message: PendingMessage | PendingMessageWithGasTank,
    msgLog: Logger,
  ): Promise<{
    params: RelayMessageParams
    clientsAndAccount: {
      client: PublicClient
      walletClient: WalletClient
      account: Account
    }
  } | null> {
    const clientsAndAccount = await this.getClientsAndAccount(
      message.destination,
      msgLog,
    )
    if (!clientsAndAccount) {
      msgLog.warn(`no client for destination ${message.destination}`)
      return null
    }

    const { account } = clientsAndAccount

    try {
      await this.validate(message)
    } catch (error) {
      msgLog.warn({ err: error }, `message validation failed`)
      return null
    }

    const params = this.buildMessageParams(message, account)

    return { params, clientsAndAccount }
  }

  /**
   * Processes pending claims
   * @returns void
   */
  private async processPendingClaims(): Promise<void> {
    const accounts = await this.fetchAllAccounts().catch((error) => {
      this.log.error({ err: error }, 'failed to fetch accounts')
      throw error
    })
    const pendingClaims = await this.fetchPendingClaims(accounts).catch(
      (error) => {
        this.log.error({ err: error }, 'failed to fetch pending claims')
        throw error
      },
    )
    this.log.info(`${pendingClaims.length} pending claims found`)

    // Process all claims in parallel
    await Promise.allSettled(
      pendingClaims.map((claim) => this.processClaim(claim)),
    ).catch((error) => {
      this.log.error({ err: error }, 'failed to process pending claims')
      throw error
    })
  }

  /**
   * Fetches pending claims for the given relayers
   * @param relayers - The relayers to fetch pending claims for
   * @returns The pending claims
   * @throws Error if the pending claims fetch fails
   */
  private async fetchPendingClaims(
    relayers: Address[],
  ): Promise<PendingClaims> {
    const relayersParam = JSON.stringify(relayers)
    const url = `${
      this.config.ponderInteropApi
    }/messages/pending/claims?relayers=${encodeURIComponent(relayersParam)}`
    const resp = await fetch(url, jsonFetchParams)
    if (!resp.ok) {
      throw new Error(`pending claims fetch http response: ${resp.statusText}`)
    }

    const body = await resp.json()
    const { data: claims, error } = PendingClaimsSchema.safeParse(body)
    if (error) {
      throw new Error(
        `api response: ${error.errors
          .map((e) => `{${e.path.join('.')}: ${e.message}}`)
          .join(', ')}`,
      )
    }
    return claims
  }

  /**
   * Fetches pending claims for a given gas provider
   * @param gasProvider - The gas provider to fetch pending claims for
   * @param gasProviderChainId - The chain ID to fetch pending claims for
   * @returns The pending claims
   */
  private async fetchPendingClaimsForGasProvider(
    gasProvider: Address,
    gasProviderChainId: number,
  ): Promise<PendingRelayCostForGasProvider> {
    const url = `${
      this.config.ponderInteropApi
    }/messages/pending/claims/${encodeURIComponent(
      gasProvider,
    )}/${encodeURIComponent(gasProviderChainId)}`
    const resp = await fetch(url, jsonFetchParams)
    if (!resp.ok) {
      throw new Error(`pending claims fetch http response: ${resp.statusText}`)
    }

    const body = await resp.json()
    const { data: pendingRelayCosts, error } =
      PendingRelayCostForGasProviderSchema.safeParse(body)
    if (error) {
      throw new Error(
        `api response: ${error.errors
          .map((e) => `{${e.path.join('.')}: ${e.message}}`)
          .join(', ')}`,
      )
    }
    return pendingRelayCosts
  }

  /**
   * Processes a pending claim
   * @param claim - The pending claim
   * @returns void
   */
  private async processClaim(claim: PendingClaim): Promise<void> {
    const msgLog = this.log.child({
      action: 'processClaim',
      messageHash: claim.relayReceipt.messageHash,
      relayer: claim.relayReceipt.relayer,
      relayCost: claim.relayReceipt.relayCost,
      relayedAt: claim.relayReceipt.relayedAt,
      chainId: claim.relayReceipt.chainId,
      timestamp: claim.relayReceipt.timestamp,
      gasTankProvider: claim.relayReceipt.gasProvider,
      gasTankProviderChainId: claim.relayReceipt.gasProviderChainId,
    })

    const clientsAndAccount = await this.getClientsAndAccount(
      claim.relayReceipt.gasProviderChainId,
      msgLog,
    )
    if (!clientsAndAccount) return

    const { client, walletClient, account } = clientsAndAccount

    const params = this.buildClaimParams(claim, account)

    try {
      const claimTxHash = await this.claimMessageViaGasTank({
        client,
        walletClient,
        gasTankAddress: this.config.gasTankAddress!,
        params,
        msgLog,
      })
      msgLog.info({ claimTxHash }, 'submitted message claim')
    } catch (error) {
      msgLog.warn({ err: error }, 'claim failed, skipping...')
    }
  }

  private async getClientsAndAccount(
    chainId: number,
    msgLog: Logger,
  ): Promise<{
    client: PublicClient
    walletClient: WalletClient
    account: Account
  } | null> {
    if (!this.config.clients[chainId] || !this.config.walletClients[chainId]) {
      msgLog.warn('no client for destination, skipping...')
      return null
    }

    const client = this.config.clients[chainId]
    const walletClient = this.config.walletClients[chainId]

    // If no account is configured (sponsored), specify
    // a random account owned by the sponsored endpoint
    // this account will not actually be used for submitting
    // the transaction, but typescript requires it to be
    // present.
    let account = walletClient.account
    if (!account) {
      const addresses = await walletClient.getAddresses()
      if (addresses.length === 0) {
        msgLog.warn('no accounts found, skipping...')
        return null
      }

      const randomIndex = Math.floor(Math.random() * addresses.length)
      account = { address: addresses[randomIndex], type: 'json-rpc' }
    }

    return { client, walletClient, account }
  }

  /**
   * Gets the balance of a gas provider taking into account pending claims and pending withdrawals
   * @param gasProvider - The gas provider
   * @returns The balance of the gas provider
   */
  private async getGasProviderBalance(gasProvider: GasTankProvider) {
    const pendingClaimsCost = await this.fetchPendingClaimsForGasProvider(
      gasProvider.gasProviderAddress,
      gasProvider.gasTankChainId,
    )
    const balance =
      gasProvider.gasProviderBalance -
      (pendingClaimsCost?.totalPendingRelayCost || 0) -
      (gasProvider.pendingWithdrawal?.amount || 0)
    return balance > 0 ? balance : 0
  }

  /**
   * Builds the message parameters for the message to be relayed
   * @param message - The message to be relayed
   * @param account - The account to be used for the relay
   * @returns The message parameters
   */
  private buildMessageParams(
    message: PendingMessage | PendingMessageWithGasTank,
    account: Account,
  ): RelayMessageParams {
    const id: MessageIdentifier = {
      origin: contracts.l2ToL2CrossDomainMessenger.address,
      chainId: BigInt(message.source),
      logIndex: BigInt(message.logIndex),
      blockNumber: BigInt(message.blockNumber),
      timestamp: BigInt(message.timestamp),
    }
    const payload = message.logPayload
    const accessList = encodeAccessList(id, payload)

    return { id, payload, accessList, account, chain: null }
  }

  /**
   * Builds the claim parameters for claiming funds from the gas tank
   * @param claim - The pending claim
   * @param account - The account to be used for the claim
   * @param gasProvider - The gas provider to be used for the claim
   * @returns The claim parameters
   */
  private buildClaimParams(claim: PendingClaim, account: Account) {
    const id: MessageIdentifier = {
      origin: claim.relayReceipt.origin,
      chainId: BigInt(claim.relayReceipt.chainId),
      logIndex: BigInt(claim.relayReceipt.logIndex),
      blockNumber: BigInt(claim.relayReceipt.blockNumber),
      timestamp: BigInt(claim.relayReceipt.timestamp),
    }
    const payload = claim.relayReceipt.logPayload
    const accessList = encodeAccessList(id, payload)

    return { id, payload, accessList, account }
  }

  private async fetchAllAccounts(): Promise<Address[]> {
    const accounts: Address[] = []
    for (const walletClient of Object.values(this.config.walletClients)) {
      const addresses = await walletClient.getAddresses()
      accounts.push(...addresses)
    }
    return accounts
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

  /**
   * Relays a message via the L2ToL2CrossDomainMessenger contract
   * @param client - The public client
   * @param walletClient - The wallet client
   * @param params - The message parameters
   * @param msgLog - The logger
   * @returns The transaction hash of the relayed message
   */
  private async relayMessageViaL2ToL2CrossDomainMessenger({
    client,
    walletClient,
    params,
    msgLog,
  }: {
    client: PublicClient
    walletClient: Client
    params: RelayMessageParams
    msgLog: Logger
  }): Promise<Hex> {
    try {
      await simulateRelayCrossDomainMessage(client, params)
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

  /**
   * Relays a message via the GasTank contract
   * @param client - The public client
   * @param walletClient - The wallet client
   * @param gasTankAddress - The address of the gas tank
   * @param params - The message parameters
   * @param msgLog - The logger
   * @param message - The message to relay
   * @param gasTankProvider - The gas tank provider
   * @returns The transaction hash of the relayed message
   */
  private async relayMessageViaGasTank({
    client,
    walletClient,
    gasTankAddress,
    params,
    msgLog,
    message,
    gasTankProvider,
  }: {
    client: PublicClient
    walletClient: WalletClient
    gasTankAddress: Address
    params: RelayMessageParams
    msgLog: Logger
    message: PendingMessageWithGasTank
    gasTankProvider: GasTankProvider
  }): Promise<Hex> {
    const { id, payload, account, accessList, chain } = params
    const contractArgs = {
      address: gasTankAddress,
      abi: gasTankAbi,
      functionName: 'relayMessage',
      args: [
        id,
        payload,
        gasTankProvider.gasProviderAddress,
        BigInt(gasTankProvider.gasTankChainId),
      ],
      account,
      accessList,
    } as const
    const block = await client.getBlock()

    const [simulatedRelayGasCost, simulatedNestedMessages] = (
      await simulateContract(client, {
        ...contractArgs,
        blockNumber: block.number,
      }).catch((error) => {
        msgLog.warn({ err: error }, 'relay failed simulation')
        throw error
      })
    ).result

    const baseFee = block.baseFeePerGas || 0n
    const estimatedClaimOverhead = await readContract(client, {
      address: gasTankAddress,
      abi: gasTankAbi,
      functionName: 'simulateClaimOverhead',
      args: [BigInt(simulatedNestedMessages.length), baseFee],
    })
    // Add a buffer to the simulated gas cost to account for base fee increases.
    const totalGasCost =
      ((simulatedRelayGasCost + estimatedClaimOverhead) * GAS_BUFFER) / 100n
    const balance = await this.getGasProviderBalance(gasTankProvider).catch(
      (error) => {
        msgLog.warn(
          { err: error },
          `failed to get gas provider balance ${gasTankProvider.gasProviderAddress}`,
        )
        throw error
      },
    )
    const hasEnoughFunds = balance >= totalGasCost

    if (!hasEnoughFunds) {
      msgLog.warn(
        {
          message,
          estimatedClaimOverhead,
          simulatedRelayGasCost,
          totalGasCost,
          gasTankProvider,
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

  /**
   * Claims the gas cost of a relayed message via the GasTank contract
   * @param client - The public client
   * @param walletClient - The wallet client
   * @param gasTankAddress - The address of the gas tank
   * @param params - The message parameters
   * @param msgLog - The logger
   * @returns The transaction hash of the claimed message
   */
  private async claimMessageViaGasTank({
    client,
    walletClient,
    gasTankAddress,
    params,
    msgLog,
  }: {
    client: PublicClient
    walletClient: WalletClient
    gasTankAddress: Address
    params: {
      id: MessageIdentifier
      payload: Hex
      account: Account
      accessList: AccessList
    }
    msgLog: Logger
  }): Promise<Hex> {
    const { id, payload, account, accessList } = params
    const contractArgs = {
      address: gasTankAddress,
      abi: gasTankAbi,
      functionName: 'claim',
      args: [id, payload],
      account,
      accessList,
    } as const

    try {
      await simulateContract(client, {
        ...contractArgs,
      })
    } catch (error) {
      msgLog.warn({ err: error }, 'claim failed simulation')
      throw error
    }

    try {
      return await writeContract(walletClient, {
        ...contractArgs,
        chain: null,
      })
    } catch (error) {
      msgLog.warn({ err: error }, 'claim failed')
      throw error
    }
  }
}
