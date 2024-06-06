import { faucetAbi } from '@eth-optimism/contracts-ecosystem'
import type { RouterCaller } from '@trpc/server'
import type { getIronSession } from 'iron-session'
import type {
  Account,
  Address,
  Chain,
  PrivateKeyAccount,
  PublicClient,
  TestClient,
  Transport,
  WalletClient,
} from 'viem'
import { parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { SessionData } from '@/constants'
import {
  createSignedInCaller,
  mockDB,
  mockLogger,
  mockPrivyClient,
  validSession,
} from '@/testhelpers'
import type { WorldIdSessionType } from '@/testhelpers/auth'
import {
  deployFaucetContract,
  deployOffChainFamContract,
  deployOnChainFamContract,
} from '@/testhelpers/deployFaucetContracts'
import {
  createL2PublicClient,
  createL2TestClient,
  createL2WalletClient,
} from '@/testUtils/anvil'
import { Trpc } from '@/Trpc'
import * as getTempFaucetAccessAttestation from '@/utils/getTempFaucetAccessAttestation'
import * as verifyWorldIdUserModule from '@/utils/verifyWorldIdUser'

import { Faucet } from '../../utils/Faucet'
import { RedisCache } from '../../utils/redis'
import { FaucetRoute } from './FaucetRoute'

describe(FaucetRoute.name, () => {
  let publicClient: PublicClient
  let walletClient: WalletClient<Transport, Chain, Account>
  let testClient: TestClient
  let faucetAddress: Address
  let onChainFamAddress: Address
  let offChainFamAddress: Address
  let faucetAdminAccount: PrivateKeyAccount
  let ownerAccount: PrivateKeyAccount
  let recipientAccount: PrivateKeyAccount

  let trpc: Trpc
  let session: Awaited<ReturnType<typeof getIronSession<SessionData>>>
  let caller: ReturnType<RouterCaller<FaucetRoute['handler']['_def']>>
  const redisCache = new RedisCache('redis://redis-app:6739')

  beforeEach(async () => {
    vi.useFakeTimers().setSystemTime(new Date('04/20/2020'))
    session = await validSession({
      nullifierHash: 'nullifierHash',
      isVerified: true,
      createdAt: Date.now().toString(),
    } as WorldIdSessionType)
    const privyClient = mockPrivyClient()

    trpc = new Trpc(privyClient, mockLogger, mockDB)

    publicClient = createL2PublicClient()
    walletClient = createL2WalletClient()
    testClient = createL2TestClient()

    faucetAdminAccount = privateKeyToAccount(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    )

    ownerAccount = privateKeyToAccount(
      '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    )
    recipientAccount = privateKeyToAccount(
      '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
    )

    faucetAddress = await deployFaucetContract(
      publicClient,
      walletClient,
      faucetAdminAccount,
    )

    await testClient.setBalance({
      address: faucetAddress,
      value: parseEther('1000'),
    })

    onChainFamAddress = await deployOnChainFamContract(
      publicClient,
      walletClient,
      faucetAdminAccount,
    )

    offChainFamAddress = await deployOffChainFamContract(
      publicClient,
      walletClient,
      faucetAdminAccount,
    )

    const oneDayInSeconds = 1 * 60 * 60 * 24

    await walletClient.writeContract({
      abi: faucetAbi,
      address: faucetAddress,
      functionName: 'configure',
      args: [
        onChainFamAddress,
        {
          ttl: BigInt(oneDayInSeconds),
          amount: parseEther('1'),
          name: 'ON_CHAIN_ADMIN_FAM',
          enabled: true,
        },
      ],
      account: faucetAdminAccount,
      chain: walletClient.chain,
    })

    await walletClient.writeContract({
      abi: faucetAbi,
      address: faucetAddress,
      functionName: 'configure',
      args: [
        offChainFamAddress,
        {
          ttl: BigInt(oneDayInSeconds),
          amount: parseEther('.05'),
          name: 'OFF_CHAIN_ADMIN_FAM',
          enabled: true,
        },
      ],
      account: faucetAdminAccount,
      chain: walletClient.chain,
    })

    const route = new FaucetRoute(trpc, [
      new Faucet({
        chainId: 11155111,
        redisCache: redisCache,
        faucetAddress: faucetAddress,
        displayName: 'Sepolia',
        onChainDripAmount: parseEther('1.0'),
        offChainDripAmount: parseEther('0.05'),
        onChainAuthModuleAddress: onChainFamAddress,
        offChainAuthModuleAddress: offChainFamAddress,
        blockExplorerUrl: 'https://sepolia.infura.io/v3',
        isL1Faucet: true,
        l1BridgeAddress: undefined,
        publicClient: publicClient,
        adminWalletClient: walletClient,
        l1ChainId: 11155111,
      }),
    ]).handler
    caller = createSignedInCaller(route, session)
  })

  afterEach(async () => {
    vi.restoreAllMocks()
  })

  describe('faucetsInfo', () => {
    it('returns the expected response', async () => {
      vi.spyOn(redisCache.redisClient, 'get').mockImplementation(() => {
        return Promise.resolve(
          JSON.stringify({ type: 'bigint', value: `${parseEther('4200')}` }),
        )
      })

      const faucetsInfo = await caller.faucetsInfo()

      expect(faucetsInfo).toEqual([
        {
          chainId: 11155111,
          displayName: 'Sepolia',
          isAvailable: true,
          onChainDripAmount: parseEther('1.0'),
          offChainDripAmount: parseEther('0.05'),
        },
      ])
    })

    it('returns isAvailable as false when balance is less than 1 eth', async () => {
      vi.spyOn(redisCache.redisClient, 'get').mockImplementation(() => {
        return Promise.resolve(
          JSON.stringify({ type: 'bigint', value: `${parseEther('0')}` }),
        )
      })

      const faucetsInfo = await caller.faucetsInfo()

      expect(faucetsInfo[0].isAvailable).toBeFalsy()
    })

    it('returns isAvailable as true when balance is greater than or equal to 1 eth', async () => {
      vi.spyOn(redisCache.redisClient, 'get').mockImplementation(() => {
        return Promise.resolve(
          JSON.stringify({ type: 'bigint', value: `${parseEther('1')}` }),
        )
      })

      const faucetsInfo = await caller.faucetsInfo()

      expect(faucetsInfo[0].isAvailable).toBeTruthy()
    })

    it('returns isAvailable as true when balance is returned as null', async () => {
      vi.spyOn(redisCache.redisClient, 'get').mockImplementation(() => {
        return Promise.resolve(null)
      })

      const faucetsInfo = await caller.faucetsInfo()

      expect(faucetsInfo[0].isAvailable).toBeTruthy()
    })

    it('returns isAvailable as true when fetching the balance returns an error', async () => {
      vi.spyOn(redisCache.redisClient, 'get').mockRejectedValue(
        new Error('Redis is offline'),
      )

      const faucetsInfo = await caller.faucetsInfo()

      expect(faucetsInfo[0].isAvailable).toBeTruthy()
    })
  })

  describe('nextDrips', () => {
    it('returns undefined for chains for which a user is eligible for a drip', async () => {
      const res = await caller.nextDrips({
        authMode: 'WORLD_ID',
        walletAddress: ownerAccount.address,
      })

      expect(res).toEqual({
        secondsUntilNextDrip: undefined,
      })
    })
  })

  describe('onChainClaims', () => {
    it('if the attested user claim, then the drip succeeds', async () => {
      vi.spyOn(
        getTempFaucetAccessAttestation,
        'getTempFaucetAccessAttestation',
      ).mockImplementation(async () => {
        return {
          id: 'mock-id',
        }
      })

      const signature = await walletClient.signMessage({
        account: ownerAccount,
        message:
          `You need to sign a message to prove you are the owner of ${ownerAccount.address} and are ` +
          `sending testnet tokens to ${recipientAccount.address}`,
      })

      const claimResponse = await caller.onChainClaims({
        recipientAddress: recipientAccount.address,
        ownerAddress: ownerAccount.address,
        signature,
        authMode: 'ATTESTATION',
        chainId: 11155111,
      })

      expect(claimResponse).toEqual({
        amountDistributed: BigInt(1000000000000000000),
        authMode: 'ATTESTATION',
        chainId: 11155111,
        error: undefined,
        etherscanUrl: `https://sepolia.infura.io/v3/tx/${claimResponse.tx}`,
        recipientAddress: recipientAccount.address,
        requestingWalletAddress: ownerAccount.address,
        tx: claimResponse.tx,
      })
    })

    it('if the world id user is verified, then the drip succeeds', async () => {
      vi.spyOn(verifyWorldIdUserModule, 'verifyWorldIdUser').mockImplementation(
        () => Promise.resolve(true),
      )

      const signature = await walletClient.signMessage({
        account: ownerAccount,
        message:
          `You need to sign a message to prove you are the owner of ${ownerAccount.address} and are ` +
          `sending testnet tokens to ${recipientAccount.address}`,
      })

      const claimResponse = await caller.onChainClaims({
        recipientAddress: recipientAccount.address,
        ownerAddress: ownerAccount.address,
        signature,
        authMode: 'WORLD_ID',
        chainId: 11155111,
      })

      expect(claimResponse).toEqual({
        amountDistributed: BigInt(1000000000000000000),
        authMode: 'WORLD_ID',
        chainId: 11155111,
        error: undefined,
        etherscanUrl: `https://sepolia.infura.io/v3/tx/${claimResponse.tx}`,
        recipientAddress: recipientAccount.address,
        requestingWalletAddress: ownerAccount.address,
        tx: claimResponse.tx,
      })
    })
  })

  describe('offChainClaims', () => {
    it('if the user user is a Privy user, then the drip succeeds', async () => {
      const claimResponse = await caller.offChainClaims({
        recipientAddress: recipientAccount.address,
        authMode: 'PRIVY',
        chainId: 11155111,
      })

      expect(claimResponse).toEqual({
        amountDistributed: BigInt(50000000000000000n),
        authMode: 'PRIVY',
        chainId: 11155111,
        error: undefined,
        etherscanUrl: `https://sepolia.infura.io/v3/tx/${claimResponse.tx}`,
        recipientAddress: recipientAccount.address,
        tx: claimResponse.tx,
      })
    })
  })
})
