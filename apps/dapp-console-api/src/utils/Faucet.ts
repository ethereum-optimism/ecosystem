import type { Address, TypedDataDomain, Hex } from 'viem'
import { getContract, keccak256, numberToHex } from 'viem'

import { faucetAbi } from '../abi/Faucet'
import { getFaucetContractBalance } from './faucetBalances'
import type { RedisCache } from './redis'
import {
  sepoliaPublicClient,
  sepoliaAdminWalletClient,
} from '../constants/faucetConfigs'

export type FaucetConstructorArgs = {
  chainId: number
  redisCache: RedisCache
  faucetAddress: Address
  onChainAuthModuleAddress: Address
  offChainAuthModuleAddress: Address
  displayName: string
  onChainDripAmount: bigint
  offChainDripAmount: bigint
  blockExplorerUrl?: string
}

export const faucetAuthModes = [
  'GITHUB',
  'OPTIMIST_NFT',
  'ATTESTATION',
  'WORLD_ID',
] as const
export type FaucetAuthMode = (typeof faucetAuthModes)[number]

export const ON_CHAIN_AUTH_MODES: FaucetAuthMode[] = [
  'OPTIMIST_NFT',
  'ATTESTATION',
  'WORLD_ID',
]

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
  private readonly redisCache: RedisCache

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
  }

  // can remove address walletclient and publicClient from getSupportedFaucets when defining each faucet. These can all become constants/hardcoded objects. And pass them in here
  private get _faucetContract() {
    return getContract({
      address: this.faucetAddress,
      abi: faucetAbi,
      client: {
        public: sepoliaPublicClient,
        wallet: sepoliaAdminWalletClient,
      },
    })
  }

  // could hardcode redis cache chainId and faucetAddress
  public async getFaucetBalance() {
    return getFaucetContractBalance({
      redisCache: this.redisCache,
      chainId: this.chainId,
      address: this.faucetAddress,
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
    const currentBlockTimestamp = (await sepoliaPublicClient.getBlock())
      .timestamp
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
      chainId: sepoliaAdminWalletClient.chain.id,
      verifyingContract: famAddress,
    }
    const dripParams = await this.createDripParams(recipientAddress)
    const authParams = await this.createAuthParams(
      recipientAddress,
      famAddress,
      userId,
      domain,
    )
    return this._faucetContract.write.drip([dripParams, authParams])
  }

  public getBlockExplorerUrlTx(tx: Hex) {
    return this.blockExplorerUrl
      ? `${this.blockExplorerUrl}/tx/${tx}`
      : undefined
  }

  private readonly createDripParams = async (recipientAddress: Address) => {
    const nonce = await sepoliaPublicClient.getTransactionCount({
      address: sepoliaAdminWalletClient.account.address,
    })
    const hashedNonce = keccak256(numberToHex(nonce))

    return {
      recipient: recipientAddress,
      nonce: hashedNonce,
    }
  }

  private readonly createAuthParams = async (
    recipientAddress: Address,
    moduleAddress: Address,
    dripId: Hex,
    domain: TypedDataDomain,
  ) => {
    const nonce = await sepoliaPublicClient.getTransactionCount({
      address: sepoliaAdminWalletClient.account.address,
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
    const signature = await sepoliaAdminWalletClient.signTypedData({
      domain,
      types,
      primaryType: 'Proof',
      message: proof,
      account: sepoliaAdminWalletClient.account,
    })

    return {
      module: moduleAddress,
      id: dripId,
      proof: signature,
    }
  }
}
