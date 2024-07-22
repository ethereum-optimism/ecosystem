import { createTestClient, encodePacked, http, keccak256, toHex } from 'viem'

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


const testClient = createTestClient({
    chain: anvil1,
    mode: 'anvil',
    transport: http(),
})

// struct (UIntSet): https://github.com/OpenZeppelin/openzeppelin-contracts/blob/b73bcb231fb6f5e7bc973edc75ab7f6c812a2255/contracts/utils/structs/EnumerableSet.sol#L51C5-L57C6
export async function main() {
    const chainId = 101
    const depedencySetSlot = 8

    const _valuesSlot = keccak256(encodePacked(['uint256'], [BigInt(8)]))    
    const _positionsSlot = keccak256(encodePacked(['uint256', 'uint256'], [BigInt(chainId), BigInt(depedencySetSlot) + 1n]));

    await testClient.setStorageAt({
        address: '0x4200000000000000000000000000000000000015',
        index: _valuesSlot,
        value: toHex(chainId, { size: 32 }),
    });

    await testClient.setStorageAt({
        address: '0x4200000000000000000000000000000000000015',
        index: _positionsSlot,
        value:  toHex(1n, { size: 32 }),
    });
}

main()
