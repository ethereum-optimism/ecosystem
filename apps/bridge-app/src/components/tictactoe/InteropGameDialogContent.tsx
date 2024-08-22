import { Button, Text } from "@eth-optimism/ui-components"
import { UseInteropStatus, useInterop } from "@eth-optimism/wagmi"
import { InteropTransactionData } from "@/hooks/useInterop"
import { RiCheckboxBlankCircleLine, RiCheckboxCircleFill, RiLoader2Fill } from "@remixicon/react"
import { useCallback } from "react"
import { Abi, AbiStateMutability, Address, Chain, ContractFunctionArgs, ContractFunctionName } from "viem"

export type InteropDialogContentProps<
    TAbi extends Abi | readonly unknown[],
    TFunctionName extends ContractFunctionName<TAbi>,
> = {
    abi: TAbi
    args: ContractFunctionArgs<TAbi, AbiStateMutability, TFunctionName>
    originChain: Chain
    destinationChain: Chain
    contractAddress: Address
    functionName: TFunctionName,
    onComplete: (transactionData: InteropTransactionData) => Promise<void>
}

export type InteropStepCellProps = {
    title: string
    currentStatus: UseInteropStatus
    activeStatuses?: UseInteropStatus[]
}

const BUTTON_TEXT: Record<UseInteropStatus, string> = {
    initiate: 'Initiate Message',
    switchChain: 'Switch Chain',
    execute: 'Execute Message',
    complete: 'Done',
}

export const InteropStepCell = ({
    title,
    currentStatus,
    activeStatuses,
}: InteropStepCellProps) => (
    <div className="flex flex-col items-center">
        {activeStatuses?.includes(currentStatus) ? <RiCheckboxCircleFill /> : <RiCheckboxBlankCircleLine />}
        <Text className="mt-3">
            {title}
        </Text>
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
        switchToDestination,
        sendMessage,
        executeMessage,
        isPending,
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
        switchChain: switchToDestination,
        execute: executeMessage,
        complete: handleComplete,
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row justify-center gap-6 my-6">
                <InteropStepCell
                    currentStatus={status}
                    activeStatuses={['switchChain', 'execute', 'complete']}
                    title="Initiate Message"
                />

                <InteropStepCell
                    currentStatus={status}
                    activeStatuses={['execute', 'complete']}
                    title="Switch Chain"
                />

                <InteropStepCell
                    currentStatus={status}
                    activeStatuses={['execute', 'complete']}
                    title="Execute Message"
                />
            </div>
            <Button onClick={handlerMap[status] ?? undefined}>
                {isPending ? <RiLoader2Fill /> : null} {BUTTON_TEXT[status]}
            </Button>
        </div>
    )
}
