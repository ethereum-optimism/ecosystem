import { Chain, defineChain } from "viem"
import { foundry } from "viem/chains"

export const anvil1 = defineChain({
    ...foundry,
    id: 100,
    name: 'Anvil 1',
    rpcUrls: {
        default: {
            http: ['http://127.0.0.1:54700'],
        },
    },
}) as Chain

export const anvil2 = defineChain({
    ...foundry,
    id: 101,
    name: 'Anvil 2',
    rpcUrls: {
        default: {
            http: ['http://127.0.0.1:54701'],
        },
    },
}) as Chain

