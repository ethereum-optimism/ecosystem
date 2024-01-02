import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useWriteWithdrawERC20, useWriteWithdrawETH } from 'op-wagmi'
import type { Token } from '@eth-optimism/op-app'
import { useOPWagmiConfig } from '@eth-optimism/op-app'
import { Button } from '@/components/ui/button'
import {
  Address,
  Chain,
  Hash,
  encodeFunctionData,
  formatEther,
  formatUnits,
  parseEther,
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
import { l2StandardBridgeABI, predeploys } from '@eth-optimism/contracts-ts'
import { useERC20Allowance } from '@/hooks/useERC20Allowance'
import { MAX_ALLOWANCE } from '@/constants/bridge'

export type ReviewWithdrawalDialogProps = {
  l1: Chain
  l2: Chain
  amount: string
  selectedTokenPair: [Token, Token]
  disabled?: boolean
  onSubmit?: () => void
}

export type ReviewWithdrawalDialogContent = {
  l2: Chain
  txData: {
    to: Address
    amount: bigint
    calldata: Hash
    isETH: boolean
  }
  selectedTokenPair: [Token, Token]
  gasPrice: bigint
  onSubmit?: () => void
}

const ReviewWithdrawalDialogContent = ({
  l2,
  txData,
  selectedTokenPair,
  gasPrice,
  onSubmit,
}: ReviewWithdrawalDialogContent) => {
  const { address, chain } = useAccount()
  const { opConfig } = useOPWagmiConfig({
    type: NETWORK_TYPE,
    chainId: chain?.id,
  })

  const l2PublicClient = usePublicClient({ chainId: l2.id })

  const { data: l2TxHash, writeWithdrawETHAsync } = useWriteWithdrawETH({
    config: opConfig,
  })
  const { data: l2ERC20TxHash, writeWithdrawERC20Async } =
    useWriteWithdrawERC20({ config: opConfig })

  const { allowance, approve } = useERC20Allowance({
    token: selectedTokenPair[1],
    amount: MAX_ALLOWANCE,
    owner: address as Address,
    spender: txData.to,
  })

  const txHash = txData.isETH ? l2TxHash : l2ERC20TxHash
  const [_, l2Token] = selectedTokenPair

  const onSubmitWithdrawal = useCallback(async () => {
    if (txData.isETH) {
      await writeWithdrawETHAsync({
        args: {
          to: txData.to,
          amount: txData.amount,
        },
        chainId: l2.id,
      })
    } else {
      const shouldApprove =
        !txData.isETH && (allowance.data ?? 0n) < txData.amount
      if (shouldApprove) {
        const approvalTxHash = await approve()
        await l2PublicClient.waitForTransactionReceipt({ hash: approvalTxHash })
      }

      await writeWithdrawERC20Async({
        args: {
          to: txData.to,
          l2Token: l2Token.address,
          amount: txData.amount,
        },
        chainId: l2.id,
      })
    }

    onSubmit?.()
  }, [
    writeWithdrawETHAsync,
    writeWithdrawERC20Async,
    onSubmit,
    txData,
    l2,
    l2Token,
    l2PublicClient,
  ])

  return (
    <div className="flex flex-col w-full">
      <div>
        Amount to Withdraw: {formatUnits(txData.amount, l2Token.decimals)}{' '}
        {l2Token.symbol}
      </div>
      <div>Gas Fee to Transfer: ~{formatEther(gasPrice)} ETH</div>
      <div>Time to transfer: ~1 minute</div>
      {txHash ? (
        <div>
          View Transaction:{' '}
          <a
            className="cursor-pointer underline"
            href={`${l2.blockExplorers?.default.url}/tx/${l2TxHash}`}
          >
            link
          </a>
        </div>
      ) : (
        <Button onClick={onSubmitWithdrawal}>Submit Withdrawal</Button>
      )}
    </div>
  )
}

export const ReviewWithdrawalDialog = ({
  l2,
  amount,
  disabled,
  selectedTokenPair,
  onSubmit,
}: ReviewWithdrawalDialogProps) => {
  const { chain } = useAccount()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const estimateFeePerGas = useEstimateFeesPerGas({ chainId: chain?.id })

  const [_, l2Token] = selectedTokenPair

  const txData = useMemo(() => {
    const isETH = l2Token.extensions.opTokenId.toLowerCase() === 'eth'
    const parsedAmount = isETH
      ? parseEther(amount ?? '0')
      : parseUnits(amount ?? '0', l2Token.decimals)

    let calldata: Hash

    if (isETH) {
      calldata = encodeFunctionData({
        abi: l2StandardBridgeABI,
        functionName: 'withdraw',
        args: [
          predeploys.LegacyERC20ETH.address as Address,
          parsedAmount,
          0,
          '0x',
        ],
      })
    } else {
      calldata = encodeFunctionData({
        abi: l2StandardBridgeABI,
        functionName: 'withdrawTo',
        args: [
          l2Token.address,
          predeploys.L2StandardBridge.address as Address,
          parsedAmount,
          0,
          '0x',
        ],
      })
    }

    return {
      to: predeploys.L2StandardBridge.address as Address,
      amount: parsedAmount,
      calldata: calldata,
      isETH,
    }
  }, [amount, l2Token])

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
          Review Withdrawal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Review Withdrawal</DialogHeader>
        {isDialogOpen && (
          <ReviewWithdrawalDialogContent
            l2={l2}
            txData={txData}
            gasPrice={gasPrice}
            selectedTokenPair={selectedTokenPair}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
