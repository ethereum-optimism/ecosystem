import { useCallback } from "react"
import { Address, Hash, Hex } from "viem"
import { usePublicClient, useWriteContract } from "wagmi"
import { L2ToL2CrossDomainMessengerABI, L2ToL2CrossDomainMessengerAddress } from "./abi/L2ToL2CrossDomainMessenger"
import { CrossL2InboxABI, CrossL2InboxAddress } from "./abi/CrossL2Inbox"
import { getL2ToL2Message } from "./getL2ToL2Message"
import { MessageIdentifier } from "./types"

export type SendL2ToL2MessageArgs = {
    chainId: number
    target: Address
    message: Hex
}
export type SendMessageHandler = (args: SendL2ToL2MessageArgs) =>  Promise<Hash>

export type ExecuteL2ToL2MessageArgs = {
    id: MessageIdentifier
    target: Address
    message: Hex
}
export type ExecuteMessageHandler = (args: ExecuteL2ToL2MessageArgs) => Promise<Hash>

export type WaitForL2ToL2MessageReturnType = {
    id: MessageIdentifier
    payload: Hex
}
export type WaitForMessageIdentifierHandler = (hash: Hash) => Promise<WaitForL2ToL2MessageReturnType>

export const useInterop = () => {
    const publicClient = usePublicClient()
    const { writeContractAsync } = useWriteContract()

    const sendMessage = useCallback<SendMessageHandler>(async ({ chainId, target, message }: SendL2ToL2MessageArgs) => {
        return await writeContractAsync({
            abi: L2ToL2CrossDomainMessengerABI,
            address: L2ToL2CrossDomainMessengerAddress,
            args: [BigInt(chainId), target, message],
            functionName: 'sendMessage',
        })
    }, [writeContractAsync])

    const executeMessage = useCallback<ExecuteMessageHandler>(async ({ id, target, message }: ExecuteL2ToL2MessageArgs) => {
        return await writeContractAsync({
            abi: CrossL2InboxABI,
            address: CrossL2InboxAddress,
            args: [id, target, message],
            functionName: 'executeMessage', 
        })
    }, [writeContractAsync])

    const waitForL2ToL2MessageReceipt = useCallback<WaitForMessageIdentifierHandler>(async (hash: Hash) => {
        return getL2ToL2Message({ client: publicClient, hash })
    }, [publicClient])

    return { sendMessage, executeMessage, waitForL2ToL2MessageReceipt }
}
