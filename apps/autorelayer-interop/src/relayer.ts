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

const gasTankProviderSchema = z.object({
  gasTankChainId: z.number(),
  gasProviderBalance: z.number(),
  gasProviderAddress: z
    .string()
    .refine(isAddress, 'invalid gas provider address'),
})

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
    relayer: z.string().refine(isAddress, 'invalid relayer'),
    relayCost: z.number(),
    relayedAt: z.number(),
  }),
  gasTankProviders: z.array(gasTankProviderSchema),
})

export const PendingClaimsSchema = z.array(PendingClaimSchema)

export type PendingClaim = z.infer<typeof PendingClaimSchema>

export type PendingClaims = z.infer<typeof PendingClaimsSchema>

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

  private async relayPendingMessages(): Promise<void> {
    const pendingMessages = await this.fetchPendingMessages()
    this.log.info(`${pendingMessages.length} pending messages`)

    // Process all messages in parallel
    await Promise.allSettled(
      pendingMessages.map((message) => this.relayMessage(message)),
    )
  }

  private async relayMessage(
    message: PendingMessage | PendingMessageWithGasTank,
  ): Promise<void> {
    const msgLog = this.log.child({
      source: message.source,
      destination: message.destination,
      messageHash: message.messageHash,
      txHash: message.transactionHash,
    })

    const clientsAndAccount = await this.getClientsAndAccount(
      message.destination,
      msgLog,
    )
    if (!clientsAndAccount) return

    const { client, walletClient, account } = clientsAndAccount

    try {
      await this.validate(message)
    } catch (error) {
      msgLog.warn(
        { err: error },
        `validation failed, skipping message ${message.messageHash}`,
      )
      return
    }

    const params = this.buildMessageParams(message, account)

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
    }
  }

  private async processPendingClaims(): Promise<void> {
    const accounts = await this.fetchAllAccounts()
    const pendingClaims = await this.fetchPendingClaims(accounts)
    this.log.info(`${pendingClaims.length} pending claims found`)

    // Process all claims in parallel
    await Promise.allSettled(
      pendingClaims.map((claim) => this.processClaim(claim)),
    )
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

  private async processClaim(claim: PendingClaim): Promise<void> {
    const msgLog = this.log.child({
      messageHash: claim.relayReceipt.messageHash,
    })

    const gasProvider = this.selectGasProvider(claim, msgLog)
    if (!gasProvider) return

    const clientsAndAccount = await this.getClientsAndAccount(
      gasProvider.gasTankChainId,
      msgLog,
    )
    if (!clientsAndAccount) return

    const { client: publicClient, walletClient, account } = clientsAndAccount

    const params = this.buildClaimParams(
      claim,
      account,
      gasProvider.gasProviderAddress,
    )

    try {
      const claimTxHash = await this.claimMessageViaGasTank({
        publicClient,
        walletClient,
        gasTankAddress: this.config.gasTankAddress!,
        params,
        msgLog,
      })
      msgLog.info({ claimTxHash }, 'submitted message claim')
    } catch (error) {
      msgLog.warn('claim failed, skipping...')
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
   * Selects the gas provider with the highest balance
   * @param claim - The pending claim
   * @param msgLog - The logger
   * @returns The gas provider with the highest balance
   */
  private selectGasProvider(claim: PendingClaim, msgLog: Logger) {
    const gasTankProvidersWithFunds = claim.gasTankProviders.filter(
      (provider) => provider.gasProviderBalance >= claim.relayReceipt.relayCost,
    )

    if (gasTankProvidersWithFunds.length === 0) {
      msgLog.warn('no gas tank providers with funds, skipping...')
      return null
    }

    return gasTankProvidersWithFunds.reduce(
      (max, provider) =>
        provider.gasProviderBalance > max.gasProviderBalance ? provider : max,
      gasTankProvidersWithFunds[0],
    )
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
  private buildClaimParams(
    claim: PendingClaim,
    account: Account,
    gasProvider: Address,
  ) {
    const id: MessageIdentifier = {
      origin: claim.relayReceipt.origin,
      chainId: BigInt(claim.relayReceipt.chainId),
      logIndex: BigInt(claim.relayReceipt.logIndex),
      blockNumber: BigInt(claim.relayReceipt.blockNumber),
      timestamp: BigInt(claim.relayReceipt.timestamp),
    }
    const payload = claim.relayReceipt.logPayload
    const accessList = encodeAccessList(id, payload)

    return { id, payload, accessList, account, gasProvider }
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

  private async claimMessageViaGasTank({
    publicClient,
    walletClient,
    gasTankAddress,
    params,
    msgLog,
  }: {
    publicClient: PublicClient
    walletClient: WalletClient
    gasTankAddress: Address
    params: {
      id: MessageIdentifier
      payload: Hex
      gasProvider: Address
      account: Account
      accessList: AccessList
    }
    msgLog: Logger
  }): Promise<Hex> {
    const { id, payload, gasProvider, account, accessList } = params
    const contractArgs = {
      address: gasTankAddress,
      abi: gasTankAbi,
      functionName: 'claim',
      args: [id, gasProvider, payload],
      account,
      accessList,
    } as const

    try {
      await simulateContract(publicClient, {
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
