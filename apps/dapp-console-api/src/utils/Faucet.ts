import { faucetAbi } from '@eth-optimism/contracts-ecosystem'
import { l1StandardBridgeABI } from '@eth-optimism/contracts-ts'
import type {
  Account,
  Address,
  Chain,
  Hex,
  PublicClient,
  Transport,
  TypedDataDomain,
  WalletClient,
} from 'viem'
import { encodeFunctionData, getContract, keccak256, numberToHex } from 'viem'

import {
  getFaucetAdminWalletBalance,
  getFaucetContractBalance,
} from './faucetBalances'
import type { RedisCache } from './redis'

export type FaucetConstructorArgs = {
  chainId: number
  isL1Faucet?: boolean
  redisCache: RedisCache
  faucetAddress: Address
  onChainAuthModuleAddress: Address
  offChainAuthModuleAddress: Address
  displayName: string
  onChainDripAmount: bigint
  offChainDripAmount: bigint
  blockExplorerUrl?: string
  l1BridgeAddress?: Address
  publicClient: PublicClient
  adminWalletClient: WalletClient<Transport, Chain, Account>
  l1ChainId: number
}

export const faucetAuthModes = [
  'PRIVY',
  'ATTESTATION',
  'COINBASE_VERIFICATION',
  'GITCOIN_PASSPORT',
  'WORLD_ID',
] as const
export type FaucetAuthMode = (typeof faucetAuthModes)[number]

export const ON_CHAIN_AUTH_MODES: FaucetAuthMode[] = [
  'ATTESTATION',
  'COINBASE_VERIFICATION',
  'GITCOIN_PASSPORT',
  'WORLD_ID',
]

const ETH_DEPOSIT_MIN_GAS_LIMIT = 200_000
const DRIP_MIN_GAS_LIMIT = 1_000_000

// Used for interacting with and reading from the smart contracts relevant to a faucet.
export class Faucet {
  public readonly displayName: string
  public readonly chainId: number
  public readonly onChainDripAmount: bigint
  public readonly offChainDripAmount: bigint
  public readonly faucetAddress: Address
  public readonly onChainAuthModuleAddress: Address
  public readonly offChainAuthModuleAddress: Address
  public readonly blockExplorerUrl: string | undefined
  public readonly isL1Faucet: boolean
  public readonly l1BridgeAddress: Address | undefined
  private readonly redisCache: RedisCache
  private readonly publicClient: PublicClient
  public readonly adminWalletClient: WalletClient<Transport, Chain, Account>
  private readonly l1ChainId: number

  constructor({
    chainId,
    redisCache,
    faucetAddress,
    displayName,
    onChainDripAmount,
    offChainDripAmount,
    onChainAuthModuleAddress,
    offChainAuthModuleAddress,
    blockExplorerUrl,
    isL1Faucet = false,
    l1BridgeAddress,
    publicClient,
    adminWalletClient,
    l1ChainId,
  }: FaucetConstructorArgs) {
    this.chainId = chainId
    this.displayName = displayName
    this.onChainDripAmount = onChainDripAmount
    this.offChainDripAmount = offChainDripAmount
    this.faucetAddress = faucetAddress
    this.onChainAuthModuleAddress = onChainAuthModuleAddress
    this.offChainAuthModuleAddress = offChainAuthModuleAddress
    this.blockExplorerUrl = blockExplorerUrl
    this.redisCache = redisCache
    this.isL1Faucet = isL1Faucet
    this.l1BridgeAddress = l1BridgeAddress
    this.publicClient = publicClient
    this.adminWalletClient = adminWalletClient
    this.l1ChainId = l1ChainId
  }

  private get _faucetContract() {
    return getContract({
      address: this.faucetAddress,
      abi: faucetAbi,
      client: {
        public: this.publicClient,
        wallet: this.adminWalletClient,
      },
    })
  }

  public async getFaucetBalance() {
    return getFaucetContractBalance({
      redisCache: this.redisCache,
      chainId: this.l1ChainId,
      address: this.faucetAddress,
    })
  }

  public async getAdminWalletBalance() {
    return getFaucetAdminWalletBalance({
      redisCache: this.redisCache,
      address: this.adminWalletClient.account.address,
      chainId: this.l1ChainId,
    })
  }

  /// Returns the amount of seconds until the next drip can occur for this user and
  /// auth mode. If no timeout exists then it returns null.
  public async secondsUntilNextDrip(authMode: FaucetAuthMode, userId: Hex) {
    const timeout = await this._faucetContract.read.timeouts([
      ON_CHAIN_AUTH_MODES.includes(authMode)
        ? this.onChainAuthModuleAddress
        : this.offChainAuthModuleAddress,
      userId,
    ])
    const currentBlockTimestamp = (await this.publicClient.getBlock()).timestamp
    const secondsUntilTimeoutEnds = timeout - currentBlockTimestamp
    if (secondsUntilTimeoutEnds <= 0) {
      return
    }

    return Number(secondsUntilTimeoutEnds)
  }

  public async triggerFaucetDrip({
    userId,
    recipientAddress,
    authMode,
  }: {
    userId: Hex
    recipientAddress: Address
    authMode: FaucetAuthMode
  }) {
    const isOnChainAuthMode = ON_CHAIN_AUTH_MODES.includes(authMode)
    const famAddress = isOnChainAuthMode
      ? this.onChainAuthModuleAddress
      : this.offChainAuthModuleAddress
    const domain = {
      name: isOnChainAuthMode ? 'OnChainAuthModule' : 'OffChainAuthModule',
      version: '1',
      chainId: this.l1ChainId,
      verifyingContract: famAddress,
    }
    const dripParams = await this.createDripParams(recipientAddress)
    const authParams = await this.createAuthParams(
      this.isL1Faucet ? recipientAddress : this.l1BridgeAddress!,
      famAddress,
      userId,
      domain,
    )
    const { maxPriorityFeePerGas } =
      await this.publicClient.estimateFeesPerGas()
    return this._faucetContract.write.drip([dripParams, authParams], {
      gas: BigInt(DRIP_MIN_GAS_LIMIT),
      maxPriorityFeePerGas:
        maxPriorityFeePerGas &&
        (maxPriorityFeePerGas * BigInt(110)) / BigInt(100),
    })
  }

  public getBlockExplorerUrlTx(tx: Hex) {
    return this.blockExplorerUrl
      ? `${this.blockExplorerUrl}/tx/${tx}`
      : undefined
  }

  private readonly createDripParams = async (recipientAddress: Address) => {
    const nonce = await this.publicClient.getTransactionCount({
      address: this.adminWalletClient.account.address,
    })
    const hashedNonce = keccak256(numberToHex(nonce))
    const data = this.isL1Faucet
      ? '0x'
      : encodeFunctionData({
          abi: l1StandardBridgeABI,
          functionName: 'depositETHTo',
          args: [recipientAddress, ETH_DEPOSIT_MIN_GAS_LIMIT, '0x'],
        })

    return {
      recipient: this.isL1Faucet ? recipientAddress : this.l1BridgeAddress!,
      nonce: hashedNonce,
      data,
      gasLimit: DRIP_MIN_GAS_LIMIT,
    }
  }

  private readonly createAuthParams = async (
    recipientAddress: Address,
    moduleAddress: Address,
    dripId: Hex,
    domain: TypedDataDomain,
  ) => {
    const nonce = await this.publicClient.getTransactionCount({
      address: this.adminWalletClient.account.address,
    })
    const hashedNonce = keccak256(numberToHex(nonce))
    const proof = {
      recipient: recipientAddress,
      nonce: hashedNonce,
      id: dripId,
    }

    const types = {
      Proof: [
        { name: 'recipient', type: 'address' },
        { name: 'nonce', type: 'bytes32' },
        { name: 'id', type: 'bytes32' },
      ],
    }
    const signature = await this.adminWalletClient.signTypedData({
      domain,
      types,
      primaryType: 'Proof',
      message: proof,
      account: this.adminWalletClient.account,
    })

    return {
      module: moduleAddress,
      id: dripId,
      proof: signature,
    }
  }
}
