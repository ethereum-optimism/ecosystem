import { Eta } from 'eta'
import fs from 'fs'
import * as allChains from 'viem/chains'
import type { Chain } from 'wagmi/chains'

import type { DeploymentAddresses } from '../src/types'

const SUPERCHAIN_CONFIG = './node_modules/@eth-optimism/superchain-registry/superchain/configs/chainids.json'
const DEPLOYMENT_ADDRESSES = './node_modules/@eth-optimism/superchain-registry/superchain/extra/addresses/addresses.json'
const SUPPORTED_L1_NETWORKS = './supportedL1Networks.json'

const NETWORK_PAIR_FILE_PATH = './src/configs/networkPairs.ts'
const DEPLOYMENT_ADDRESS_FILE_PATH = './src/configs/deploymentAddresses.ts'

type NetworkPair = {
    name: string
    group: string
    l1: { id: string, name: string }
    l2: { id: string, name: string }
}

type NetworkPairGroups = Record<
    string,
    {
        networks: NetworkPair[]
    } 
>

type SupportedL1Networks = {
    networks: string[]
}

const eta = new Eta({ views: './templates', debug: true });
const supportedChains = allChains as Record<string, Chain>
const supportedNetworks = new Set(readJSON<SupportedL1Networks>(SUPPORTED_L1_NETWORKS).networks)

const chainIdMap = Object.keys(supportedChains).reduce((acc, importKey) => {
    const chain = supportedChains[importKey]
    acc[chain.id] = { chain, importKey }
    return acc
}, {} as Record<string, { chain: Chain, importKey: string }>)

function readJSON<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath).toString()) as T
}

function createNetworkPairs(config: Record<string, bigint>): {
    networkPairs: NetworkPair[]
    networkPairGroups: NetworkPairGroups
    importKeys: string[]
} {
    const networkPairs = [] as NetworkPair[]
    const pairKeys = Object.keys(config) 
    const importKeys = new Set(supportedNetworks)

    const l1s = {} as Record<string, Chain>
    for (const supportedNetwork of supportedNetworks) {
        if (supportedChains[supportedNetwork]) {
            l1s[supportedNetwork] = supportedChains[supportedNetwork]
        }
    }

    const groups = new Set()
    const networkPairGroups = {} as NetworkPairGroups

    for (const pairKey of pairKeys) {
        const [l1Name, l2Name] = pairKey.split('/')

        if (supportedNetworks.has(l1Name) && config[pairKey]) {
            const l1 = l1s[l1Name]
            console.log(pairKey)
            const { chain: l2, importKey: l2ImportKey } = chainIdMap[config[pairKey].toString()]

            if (!groups.has(l2Name)) {
                networkPairGroups[l2Name] = { networks: [] }
            }

            groups.add(l2Name)
            importKeys.add(l2ImportKey)

            networkPairs.push({
                name: l1Name,
                group: l2Name,
                l1: { id: l1.id.toString(), name: l1Name },
                l2: { id: l2.id.toString(), name: l2ImportKey },
            })
        }
    }

    for (const networkPair of networkPairs) {
        networkPairGroups[networkPair.group].networks.push(networkPair)
    }

    for (const group of Object.keys(networkPairGroups)) {
        networkPairGroups[group].networks.sort()
    }

    return { networkPairs, networkPairGroups, importKeys: Array.from(importKeys) }
}

async function writeNetworkPairs(
    networkPairs: NetworkPair[],
    networkPairGroups: NetworkPairGroups,
    importKeys: string[],
) {
    const networkPairsFileContents = eta.render('networkPairs', {
        networkPairs,
        networkPairGroups,
        importKeys,
    });
    fs.writeFileSync(NETWORK_PAIR_FILE_PATH, networkPairsFileContents)
}

async function writeDeploymentAddresses(deploymentAddresses: Record<string, DeploymentAddresses>) {
    const deploymentAddressesFileContents = eta.render('deploymentAddresses', {
        deploymentAddresses,
    }).replace(/&quot;/g, '\'');
    fs.writeFileSync(DEPLOYMENT_ADDRESS_FILE_PATH, deploymentAddressesFileContents)
}

async function main() {
    // generate network pairs
    const superchains = readJSON<Record<string, bigint>>(SUPERCHAIN_CONFIG)
    const { networkPairs, networkPairGroups, importKeys } = createNetworkPairs(superchains)
    writeNetworkPairs(networkPairs, networkPairGroups, importKeys)

    // generate deployment addresses
    const deploymentAddresses = readJSON<Record<string, DeploymentAddresses>>(DEPLOYMENT_ADDRESSES)
    writeDeploymentAddresses(deploymentAddresses)
}

(async () => {
    try {
        await main()
        process.exit(0)
    } catch (e) {
        console.error(e)
        process.exit(-1)
    }
})()
