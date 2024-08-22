import { Abi, AbiStateMutability, Address, Chain, ContractFunctionArgs, ContractFunctionName, EncodeFunctionDataParameters, Hash, Hex, PublicClient, TransactionReceipt, encodeFunctionData } from "viem"
import { useSendL2ToL2Message, useExecuteL2ToL2Message } from "@eth-optimism/wagmi"
import { useCallback, useEffect, useState } from "react"
import { MessageIdentifier, extractMessageIdentifierFromLogs } from "@eth-optimism/viem"
import { useAccount, usePublicClient, useSwitchChain } from "wagmi"

export type UseInteropStatus = 'initiate' | 'switchChain' | 'execute' | 'complete'

export type InteropTransactionData = {
    sendMessageHash?: Hash
    sendMessageReceipt?: TransactionReceipt
    executeMessageHash?: Hash
    executeMessageReceipt?: TransactionReceipt
}

export type UseInteropParameters<
    TAbi extends Abi | readonly unknown[],
    TFunctionName extends ContractFunctionName<TAbi>
> = {
    abi: TAbi
    contractAddress: Address
    functionName: TFunctionName 
    originChain: Chain
    destinationChain: Chain
}

export type UseInteropReturnType<
    TAbi extends Abi | readonly unknown[],
    TFunctionName extends ContractFunctionName<TAbi>
> = {
    message: Hex | undefined
    status: UseInteropStatus
    transactionData: InteropTransactionData
    messageIdentifier?: MessageIdentifier
    switchToDestination: () => Promise<void>
    sendMessage: (args: ContractFunctionArgs<TAbi, AbiStateMutability, TFunctionName>) => Promise<void>
    executeMessage: () => Promise<void>
    isPending?: boolean
    isError?: boolean
}

export const useInterop = <
    TAbi extends Abi | readonly unknown[],
    TFunctionName extends ContractFunctionName<TAbi>
>(params: UseInteropParameters<TAbi, TFunctionName>): UseInteropReturnType<TAbi, TFunctionName> => {
    const {
        abi,
        contractAddress,
        functionName,
        originChain,
        destinationChain,
    } = params

    const { address, chainId: currentChainId } = useAccount()
    const { switchChainAsync } = useSwitchChain() 
    const originPublicClient = usePublicClient({ chainId: originChain.id })
    const destPublicClient = usePublicClient({ chainId: destinationChain.id })

    const { sendMessage, isError: isSendMessageError, isPending: isSendMessagePending } = useSendL2ToL2Message()
    const { executeMessage, isError: isExecuteMessageError, isPending: isExecuteMessagePending } = useExecuteL2ToL2Message()

    const [status, setStatus] = useState<UseInteropStatus>('initiate')
    const [message, setMessage] = useState<Hex | undefined>(undefined)
    const [messageIdentifier, setMessageIdentifier] = useState<MessageIdentifier | undefined>(undefined)
    const [transactionData, setTransactionData] = useState<InteropTransactionData>({})

    useEffect(() => {
        if (status === 'execute' && destinationChain.id !== currentChainId) {
            setStatus('switchChain')
        }
    }, [destinationChain, currentChainId, status])

    const sendMessageWrapper = useCallback(async (args: ContractFunctionArgs<TAbi, AbiStateMutability, TFunctionName>) => {
        if (status !== 'initiate') {
            throw new Error(`Status must be initiate, current status: ${status}`)
        }

        const functionData = {
            abi,
            functionName,
            args,
        } as EncodeFunctionDataParameters<TAbi, TFunctionName>

        const encodedMessage = encodeFunctionData<TAbi, TFunctionName>(functionData)

        const hash = await sendMessage({
            account: address as Address,
            destinationChainId: params.destinationChain.id,
            target: contractAddress,
            message: encodedMessage,
            chain: originChain,
        })
        
        const mutableTransactionData = {} as InteropTransactionData
        mutableTransactionData.sendMessageHash = hash

        const receipt = await originPublicClient?.waitForTransactionReceipt({ hash })
        mutableTransactionData.sendMessageReceipt = receipt

        const { id } = await extractMessageIdentifierFromLogs(originPublicClient as PublicClient, {
            receipt: receipt as TransactionReceipt,
        })

        setMessage(encodedMessage)
        setMessageIdentifier(id)
        setTransactionData(mutableTransactionData)
        setStatus('switchChain')
    }, [message, sendMessage, setMessageIdentifier, setTransactionData, setMessage])

    const switchToDestination = useCallback(async () => {
        await switchChainAsync({ chainId: destinationChain.id })
        setStatus('execute')
    }, [destinationChain, switchChainAsync])

    const executeMessageWrapper = useCallback(async () => {
        if (status !== 'execute') {
            throw new Error(`Status must be execute, current status: ${status}`)
        }

        const hash = await executeMessage({
            account: address as Address,
            id: messageIdentifier as MessageIdentifier,
            target: contractAddress,
            message: message as Hex,
            chain: destinationChain,
        })

        const mutableTransactionData = { ...transactionData }
        mutableTransactionData.executeMessageHash = hash

        const receipt = await destPublicClient?.waitForTransactionReceipt({ hash })
        mutableTransactionData.executeMessageReceipt = receipt

        setTransactionData(mutableTransactionData)
        setStatus('complete')
    }, [message, messageIdentifier])

    return {
        message,
        status,
        transactionData,
        messageIdentifier,
        switchToDestination,
        sendMessage: sendMessageWrapper,
        executeMessage: executeMessageWrapper,
        isPending: isSendMessagePending || isExecuteMessagePending,
        isError: isSendMessageError || isExecuteMessageError,
    } as unknown as UseInteropReturnType<TAbi, TFunctionName>
}
