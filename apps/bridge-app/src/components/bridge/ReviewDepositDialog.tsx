import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  Button,
} from '@eth-optimism/ui-components'
import { useWriteDepositERC20, useWriteDepositETH } from 'op-wagmi'
import type { Token } from '@eth-optimism/op-app'
import { useOPWagmiConfig, deploymentAddresses } from '@eth-optimism/op-app'

import {
  Address,
  Chain,
  Hash,
  encodeFunctionData,
  formatEther,
  formatUnits,
  parseUnits,
} from 'viem'
import {
  useAccount,
  useEstimateFeesPerGas,
  useEstimateGas,
  usePublicClient,
} from 'wagmi'
import { useCallback, useMemo, useState } from 'react'
import { NETWORK_TYPE } from '@/constants/networkType'
import {
  l1StandardBridgeABI,
  optimismPortalABI,
} from '@eth-optimism/contracts-ts'
import { ERC20_DEPOSIT_MIN_GAS_LIMIT, MAX_ALLOWANCE } from '@/constants/bridge'
import { useERC20Allowance } from '@/hooks/useERC20Allowance'

export type ReviewDepositDialogProps = {
  l1: Chain
  l2: Chain
  amount: string
  selectedTokenPair: [Token, Token]
  disabled?: boolean
  onSubmit?: () => void
}

export type ReviewDepositDialogContent = {
  l1: Chain
  l2: Chain
  txData: {
    to: Address
    amount: bigint
    calldata: Hash
    isETH: boolean
    l2Token?: Token
  }
  selectedTokenPair: [Token, Token]
  gasPrice: bigint
  onSubmit?: () => void
}

const ReviewDepositDialogContent = ({
  l1,
  l2,
  txData,
  selectedTokenPair,
  gasPrice,
  onSubmit,
}: ReviewDepositDialogContent) => {
  const { address, chain } = useAccount()
  const { opConfig } = useOPWagmiConfig({
    type: NETWORK_TYPE,
    chainId: chain?.id,
  })

  const l1PublicClient = usePublicClient({ chainId: l1.id })

  const { data: l1TxHash, writeDepositETHAsync } = useWriteDepositETH({
    config: opConfig,
  })
  const { data: l1ERC20TxHash, writeDepositERC20Async } = useWriteDepositERC20({
    config: opConfig,
  })
  const { allowance, approve } = useERC20Allowance({
    token: selectedTokenPair[0],
    amount: MAX_ALLOWANCE,
    owner: address as Address,
    spender: txData.to,
  })

  const txHash = txData.isETH ? l1TxHash : l1ERC20TxHash
  const [l1Token, l2Token] = selectedTokenPair

  const onSubmitDeposit = useCallback(async () => {
    if (txData.isETH) {
      await writeDepositETHAsync({
        args: {
          to: txData.to,
          amount: txData.amount,
        },
        l2ChainId: l2.id,
      })
    } else {
      const shouldApprove =
        !txData.isETH && (allowance.data ?? 0n) < txData.amount
      if (shouldApprove) {
        const approvalTxHash = await approve()
        await l1PublicClient.waitForTransactionReceipt({ hash: approvalTxHash })
      }

      await writeDepositERC20Async({
        args: {
          l1Token: l1Token.address as Address,
          l2Token: l2Token.address as Address,
          to: txData.to,
          amount: txData.amount,
        },
        l2ChainId: l2.id,
      })
    }
    onSubmit?.()
  }, [
    approve,
    writeDepositETHAsync,
    writeDepositERC20Async,
    onSubmit,
    txData,
    l2,
    l1PublicClient,
    l1Token,
    l2Token,
  ])

  return (
    <div className="flex flex-col w-full">
      <div>
        Amount to Deposit: {formatUnits(txData.amount, l1Token.decimals)}{' '}
        {l1Token.symbol}
      </div>
      <div>Gas Fee to Transfer: ~{formatEther(gasPrice)} ETH</div>
      <div>Time to transfer: ~1 minute</div>
      {txHash ? (
        <div>
          View Transaction:{' '}
          <a
            className="cursor-pointer underline"
            href={`${l1.blockExplorers?.default.url}/tx/${l1TxHash}`}
          >
            link
          </a>
        </div>
      ) : (
        <Button onClick={onSubmitDeposit}>Submit Deposit</Button>
      )}
    </div>
  )
}

export const ReviewDepositDialog = ({
  l1,
  l2,
  amount,
  disabled,
  selectedTokenPair,
  onSubmit,
}: ReviewDepositDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const { address, chain } = useAccount()
  const estimateFeePerGas = useEstimateFeesPerGas({ chainId: chain?.id })

  const txData = useMemo(() => {
    const addresses = deploymentAddresses[l2.id]
    if (!addresses) {
      throw new Error(`Cannont find OptimismPortalProxy for chain id ${l2.id}`)
    }

    let calldata: Hash
    const [l1Token, l2Token] = selectedTokenPair

    const isETH = l1Token.extensions.opTokenId.toLowerCase() === 'eth'
    const parsedAmount = parseUnits(amount ?? '0', l1Token.decimals)

    if (isETH) {
      calldata = encodeFunctionData({
        abi: optimismPortalABI,
        functionName: 'depositTransaction',
        args: [
          address as Address,
          parsedAmount,
          parseUnits('1', 5),
          false,
          '0x',
        ],
      })
    } else {
      calldata = encodeFunctionData({
        abi: l1StandardBridgeABI,
        functionName: 'depositERC20To',
        args: [
          l1Token.address,
          l2Token.address,
          addresses.L1StandardBridgeProxy,
          parsedAmount,
          ERC20_DEPOSIT_MIN_GAS_LIMIT,
          '0x',
        ],
      })
    }

    return {
      to: isETH
        ? addresses.OptimismPortalProxy
        : addresses.L1StandardBridgeProxy,
      amount: parsedAmount,
      calldata: calldata,
      isETH,
    }
  }, [address, amount, l2.id, selectedTokenPair])

  const gasEstimate = useEstimateGas({
    chainId: chain?.id,
    data: txData.calldata,
    to: txData.to,
    value: txData.amount,
  })

  const gasPrice = useMemo(() => {
    if (!gasEstimate.data || !estimateFeePerGas.data?.maxFeePerGas) {
      return 0n
    }
    return estimateFeePerGas.data.maxFeePerGas * gasEstimate.data
  }, [estimateFeePerGas.data?.maxFeePerGas, gasEstimate.data])

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={disabled}>
          Review Deposit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Review Deposit</DialogHeader>
        {isDialogOpen && (
          <ReviewDepositDialogContent
            l1={l1}
            l2={l2}
            selectedTokenPair={selectedTokenPair}
            txData={txData}
            gasPrice={gasPrice}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
