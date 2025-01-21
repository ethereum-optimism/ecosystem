import { createPublicClient, createWalletClient, erc20Abi, http } from 'viem'
import {
  extractTransactionDepositedLogs,
  extractWithdrawalMessageLogs,
  getL2TransactionHashes,
} from 'viem/op-stack'
import { describe, expect, it } from 'vitest'

import { optimismMintableERC20FactoryAbi } from '@/abis.js'
import { depositERC20 } from '@/actions/depositERC20.js'
import {
  estimateWithdrawERC20Gas,
  simulateWithdrawERC20,
  withdrawERC20,
} from '@/actions/withdrawERC20.js'
import { supersimL1 } from '@/chains/supersim.js'
import { contracts } from '@/contracts.js'
import { publicClientA, testAccount, walletClientA } from '@/test/clients.js'

describe('withdrawERC20', async () => {
  // Hardcoded since we don't have a good way to pull the L1 contracts for supersim yet.
  const l1StandardBridgeAddress = '0x8d515eb0e5F293B16B6bBCA8275c060bAe0056B0'

  const publicL1Client = createPublicClient({
    chain: supersimL1,
    transport: http(supersimL1.rpcUrls.default.http[0]),
  })
  const walletL1Client = createWalletClient({
    account: testAccount,
    chain: supersimL1,
    transport: http(supersimL1.rpcUrls.default.http[0]),
  })

  // Deploy WETH on L1
  const bytecode =
    '0x60606040526040805190810160405280600d81526020017f57726170706564204574686572000000000000000000000000000000000000008152506000908051906020019061004f9291906100c8565b506040805190810160405280600481526020017f57455448000000000000000000000000000000000000000000000000000000008152506001908051906020019061009b9291906100c8565b506012600260006101000a81548160ff021916908360ff16021790555034156100c357600080fd5b61016d565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061010957805160ff1916838001178555610137565b82800160010185558215610137579182015b8281111561013657825182559160200191906001019061011b565b5b5090506101449190610148565b5090565b61016a91905b8082111561016657600081600090555060010161014e565b5090565b90565b610c348061017c6000396000f3006060604052600436106100af576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100b9578063095ea7b31461014757806318160ddd146101a157806323b872dd146101ca5780632e1a7d4d14610243578063313ce5671461026657806370a082311461029557806395d89b41146102e2578063a9059cbb14610370578063d0e30db0146103ca578063dd62ed3e146103d4575b6100b7610440565b005b34156100c457600080fd5b6100cc6104dd565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561010c5780820151818401526020810190506100f1565b50505050905090810190601f1680156101395780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561015257600080fd5b610187600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061057b565b604051808215151515815260200191505060405180910390f35b34156101ac57600080fd5b6101b461066d565b6040518082815260200191505060405180910390f35b34156101d557600080fd5b610229600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061068c565b604051808215151515815260200191505060405180910390f35b341561024e57600080fd5b61026460048080359060200190919050506109d9565b005b341561027157600080fd5b610279610b05565b604051808260ff1660ff16815260200191505060405180910390f35b34156102a057600080fd5b6102cc600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610b18565b6040518082815260200191505060405180910390f35b34156102ed57600080fd5b6102f5610b30565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561033557808201518184015260208101905061031a565b50505050905090810190601f1680156103625780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561037b57600080fd5b6103b0600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610bce565b604051808215151515815260200191505060405180910390f35b6103d2610440565b005b34156103df57600080fd5b61042a600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610be3565b6040518082815260200191505060405180910390f35b34600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055503373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c346040518082815260200191505060405180910390a2565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105735780601f1061054857610100808354040283529160200191610573565b820191906000526020600020905b81548152906001019060200180831161055657829003601f168201915b505050505081565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b60003073ffffffffffffffffffffffffffffffffffffffff1631905090565b600081600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101515156106dc57600080fd5b3373ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16141580156107b457507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414155b156108cf5781600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561084457600080fd5b81600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b81600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b80600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515610a2757600080fd5b80600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501515610ab457600080fd5b3373ffffffffffffffffffffffffffffffffffffffff167f7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65826040518082815260200191505060405180910390a250565b600260009054906101000a900460ff1681565b60036020528060005260406000206000915090505481565b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bc65780601f10610b9b57610100808354040283529160200191610bc6565b820191906000526020600020905b815481529060010190602001808311610ba957829003601f168201915b505050505081565b6000610bdb33848461068c565b905092915050565b60046020528160005260406000206020528060005260406000206000915091505054815600a165627a7a72305820deb4c2ccab3c2fdca32ab3f46728389c2fe2c165d5fafa07661e4e004f6c344a0029'
  const { contractAddress: wethAddress } =
    await publicL1Client.waitForTransactionReceipt({
      hash: await walletL1Client.deployContract({
        abi: [],
        account: testAccount,
        bytecode,
      }),
    })

  // Create an custom L2 ERC20 for WETH
  const { result: l2TokenAddress } = await publicClientA.simulateContract({
    abi: optimismMintableERC20FactoryAbi,
    address: contracts.optimismMintableERC20Factory.address,
    functionName: 'createOptimismMintableERC20',
    args: [wethAddress!, 'Test', 'TEST'],
  })
  await publicClientA.waitForTransactionReceipt({
    hash: await walletClientA.writeContract({
      abi: optimismMintableERC20FactoryAbi,
      address: contracts.optimismMintableERC20Factory.address,
      functionName: 'createOptimismMintableERC20',
      args: [wethAddress!, 'Test', 'TEST'],
    }),
  })

  await publicL1Client.waitForTransactionReceipt({
    hash: await walletL1Client.writeContract({
      abi: erc20Abi,
      address: wethAddress!,
      functionName: 'approve',
      args: [l1StandardBridgeAddress, 100000n],
    }),
  })

  // Deposit & Bridge
  const depositWETHHash = await walletL1Client.sendTransaction({
    to: wethAddress,
    value: 10n,
  })
  await publicL1Client.waitForTransactionReceipt({ hash: depositWETHHash })
  const depositTxHash = await depositERC20(publicL1Client, {
    account: testAccount,
    tokenAddress: wethAddress!,
    remoteTokenAddress: l2TokenAddress,
    amount: 10n,
    l1StandardBridgeAddress,
  })

  const { logs: depositTxLogs } =
    await publicL1Client.waitForTransactionReceipt({ hash: depositTxHash })

  // await the L2 transaction
  const depositLogs = extractTransactionDepositedLogs({ logs: depositTxLogs })
  const l2TransactionHashes = getL2TransactionHashes({ logs: depositLogs })
  await publicClientA.waitForTransactionReceipt({
    hash: l2TransactionHashes[0],
  })

  await publicClientA.waitForTransactionReceipt({
    hash: await walletClientA.writeContract({
      abi: erc20Abi,
      address: l2TokenAddress,
      functionName: 'approve',
      args: [contracts.l2StandardBridge.address, 1000n],
    }),
  })

  describe('write contract', () => {
    it('should return expected request', async () => {
      const hash = await withdrawERC20(publicClientA, {
        account: testAccount,
        tokenAddress: l2TokenAddress,
        amount: 1n,
      })

      const { logs } = await publicClientA.waitForTransactionReceipt({ hash })
      const withdrawalLogs = extractWithdrawalMessageLogs({ logs })
      expect(withdrawalLogs).toBeDefined()
      expect(withdrawalLogs!.length).toBe(1)
    })
  })

  describe('estimate gas', () => {
    it('should estimate gas', async () => {
      const gas = await estimateWithdrawERC20Gas(publicClientA, {
        account: testAccount,
        tokenAddress: l2TokenAddress,
        amount: 1n,
      })

      expect(gas).toBeDefined()
    })
  })

  describe('simulate', () => {
    it('should simulate', async () => {
      expect(
        async () =>
          await simulateWithdrawERC20(publicClientA, {
            account: testAccount,
            tokenAddress: l2TokenAddress,
            amount: 1n,
          }),
      ).not.throw()
    })
  })
})
