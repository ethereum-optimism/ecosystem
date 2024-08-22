import { Button, Text } from '@eth-optimism/ui-components'
import {
  InteropTransactionData,
  useInterop,
  UseInteropStatus,
} from '@/hooks/useInterop'
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiLoader2Fill,
} from '@remixicon/react'
import { useCallback } from 'react'
import {
  Abi,
  AbiStateMutability,
  Address,
  Chain,
  ContractFunctionArgs,
  ContractFunctionName,
} from 'viem'

import l2AssetLogo from '@/assets/l2-asset-logo.png'

export type InteropDialogContentProps<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi>,
> = {
  abi: TAbi
  args: ContractFunctionArgs<TAbi, AbiStateMutability, TFunctionName>
  originChain: Chain
  destinationChain: Chain
  contractAddress: Address
  functionName: TFunctionName
  onComplete: (transactionData: InteropTransactionData) => Promise<void>
}

export type InteropStepCellProps = {
  title: string
  currentStatus: UseInteropStatus
  activeStatuses?: UseInteropStatus[]
}

const BUTTON_TEXT: Record<UseInteropStatus, string> = {
  initiate: 'Initiate Message',
  switchChainToOrigin: 'Switch Network',
  switchChainToDestination: 'Switch Network',
  execute: 'Execute Message',
  complete: 'Done',
}

export const InteropStepCell = ({
  title,
  currentStatus,
  activeStatuses,
}: InteropStepCellProps) => (
  <div className="flex flex-col items-center">
    {activeStatuses?.includes(currentStatus) ? (
      <RiCheckboxCircleFill />
    ) : (
      <RiCheckboxBlankCircleLine />
    )}
    <Text className="font-retro text-xs text-center mt-3">{title}</Text>
  </div>
)

export const InteropDialogContent = <
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi>,
>({
  abi,
  args,
  originChain,
  destinationChain,
  contractAddress,
  functionName,
  onComplete,
}: InteropDialogContentProps<TAbi, TFunctionName>) => {
  const {
    status,
    transactionData,
    switchToOrigin,
    switchToDestination,
    sendMessage,
    executeMessage,
    isPending,
    isWaitingForReceipt,
  } = useInterop({
    abi,
    contractAddress,
    functionName,
    originChain,
    destinationChain,
  })

  const handleComplete = useCallback(async () => {
    onComplete(transactionData)
  }, [transactionData, onComplete])

  const handlerMap: Record<UseInteropStatus, () => Promise<void>> = {
    initiate: () => sendMessage(args),
    switchChainToOrigin: switchToOrigin,
    switchChainToDestination: switchToDestination,
    execute: executeMessage,
    complete: handleComplete,
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-center gap-6 my-6">
        {status === 'switchChainToOrigin' ? (
          <div className="flex flex-col items-center">
            <Text className="font-retro mb-6">
              Switch to {originChain.name}
            </Text>
            <img className="h-3/4 rounded-full" src={l2AssetLogo} />
          </div>
        ) : (
          <>
            <InteropStepCell
              currentStatus={status}
              activeStatuses={[
                'switchChainToDestination',
                'execute',
                'complete',
              ]}
              title="Initiate Message"
            />

            <InteropStepCell
              currentStatus={status}
              activeStatuses={['execute', 'complete']}
              title="Switch to Destination"
            />

            <InteropStepCell
              currentStatus={status}
              activeStatuses={['complete']}
              title="Execute Message"
            />
          </>
        )}
      </div>
      <Button onClick={handlerMap[status] ?? undefined}>
        {isPending ? <RiLoader2Fill className="animate-spin mr-3" /> : null}
        <Text className="font-retro cursor-pointer">
          {isWaitingForReceipt ? 'Waiting for receipt' : BUTTON_TEXT[status]}
        </Text>
      </Button>
    </div>
  )
}
