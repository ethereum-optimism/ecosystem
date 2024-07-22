import { Hash, Hex, PublicClient } from "viem";
import { L2ToL2CrossDomainMessengerABI } from "./abi/L2ToL2CrossDomainMessenger";
import { parseEventLogs } from "viem/utils";
import { MessageIdentifier } from "./types";

export type GetL2ToL2MessageArgs = {
    client: PublicClient
    hash: Hash
}

export type GetL2ToL2MessageReturnType = {
    id: MessageIdentifier
    payload: Hex
}

export async function getL2ToL2Message({
    client,
    hash,
}: GetL2ToL2MessageArgs): Promise<GetL2ToL2MessageReturnType> {
    const receipt = await client.waitForTransactionReceipt({ hash })
    const logs = parseEventLogs({ abi: L2ToL2CrossDomainMessengerABI, logs: receipt.logs, eventName: 'SentMessage' })
    
    const sentMessageLog = logs[0]
    if (!sentMessageLog?.data) {
        throw new Error('Message Identifier does not exist for hash')
    }

    const block = await client.getBlock({ blockHash: sentMessageLog.blockHash })
    const id = {
        origin: receipt.from,
        blockNumber: sentMessageLog.blockNumber,
        logIndex: BigInt(sentMessageLog.logIndex),
        timestamp: BigInt(0), // block.timestamp
        chainId: BigInt(101),
    } as MessageIdentifier

    return {
        id,
        payload: sentMessageLog.data
    }
}