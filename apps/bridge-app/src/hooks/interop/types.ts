import { Address } from "viem"

export type MessageIdentifier = {
    origin: Address
    blockNumber: bigint
    logIndex: bigint
    timestamp: bigint
    chainId: bigint
}
