import { Eta } from 'eta'
import fs from 'fs'
import yaml from 'js-yaml'
import type { Hash } from 'viem'
import * as allChains from 'viem/chains'
import type { Chain } from 'wagmi/chains'

import type { DeploymentAddresses } from '../src/types'

const SUPERCHAIN_CONFIG =
  './node_modules/@eth-optimism/superchain-registry/superchain/configs/chainids.json'
const DEPLOYMENT_ADDRESSES =
  './node_modules/@eth-optimism/superchain-registry/superchain/extra/addresses/addresses.json'
const CHAIN_CONFIG =
  './node_modules/@eth-optimism/superchain-registry/superchain/configs'
const SUPPORTED_L1_NETWORKS = './supportedL1Networks.json'

const NETWORK_PAIR_FILE_PATH = './src/configs/networkPairs.ts'
const DEPLOYMENT_ADDRESS_FILE_PATH = './src/configs/deploymentAddresses.ts'
const CHAINS_FILE_PATH = './src/configs/chains.ts'

type ChainDef = {
  name: string
  chain_id: number
  public_rpc: string
  sequencer_rpc: string
  explorer: string
  genesis: {
    l1: {
      hash: Hash
      number: number
    }
    l2: {
      hash: Hash
      number: 0
    }
    l2_time: number
  }
  source_chain_id?: number
}

type NetworkPair = {
  name: string
  group: string
  l1: { id: string; name: string }
  l2: { id: string; name: string }
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

const eta = new Eta({ views: './templates', debug: true })
const supportedChains = allChains as Record<string, Chain>
const supportedNetworks = new Set(
  readJSON<SupportedL1Networks>(SUPPORTED_L1_NETWORKS).networks,
)

const devnetDeploymentAddresses: Record<string, DeploymentAddresses> = {
  '901': {
    AddressManager: '0xBb2180ebd78ce97360503434eD37fcf4a1Df61c3',
    L1CrossDomainMessengerProxy: '0x0c8b5822b6e02CDa722174F19A1439A7495a3fA6',
    L1ERC721BridgeProxy: '0xDeF3bca8c80064589E6787477FFa7Dd616B5574F',
    L1StandardBridgeProxy: '0x1c23A6d89F95ef3148BCDA8E242cAb145bf9c0E4',
    L2OutputOracleProxy: '0xD31598c909d9C935a9e35bA70d9a3DD47d4D5865',
    OptimismMintableERC20FactoryProxy:
      '0x20A42a5a785622c6Ba2576B2D6e924aA82BFA11D',
    OptimismPortalProxy: '0x978e3286EB805934215a88694d80b09aDed68D90',
    ProxyAdmin: '0xDB8cFf278adCCF9E9b5da745B44E754fC4EE3C76',
    SystemConfigProxy: '0x229047fed2591dbec1eF1118d64F7aF3dB9EB290',
    ProxyAdminOwner: '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
  },
}

const chainIdMap = Object.keys(supportedChains).reduce(
  (acc, importKey) => {
    const chain = supportedChains[importKey]
    acc[chain.id] = { chain, importKey }
    return acc
  },
  {} as Record<string, { chain: Chain; importKey: string }>,
)

const customChainIdMap = {} as Record<string, ChainDef>

function camelCase(str: string): string {
  const parts = str.split(' ')
  return (
    parts[0].toLowerCase() +
    parts
      .slice(1)
      .map((part) => part[0].toUpperCase() + part.substring(1))
      .join('')
  )
}

function readJSON<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath).toString()) as T
}

function readYAML<T>(filePath: string) {
  return yaml.load(fs.readFileSync(filePath, 'utf8')) as T
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

      let l2ChainId = 0
      let l2ImportKey: string | undefined
      let l2CustomImportKey: string | undefined
      const chainIdKey = config[pairKey].toString()

      if (chainIdMap[chainIdKey]) {
        const { chain, importKey } = chainIdMap[chainIdKey]
        l2ChainId = chain.id
        l2ImportKey = importKey
      } else if (customChainIdMap[chainIdKey]) {
        l2ChainId = customChainIdMap[chainIdKey].chain_id
        l2CustomImportKey = camelCase(customChainIdMap[chainIdKey].name)
      }

      if (!groups.has(l2Name)) {
        networkPairGroups[l2Name] = { networks: [] }
      }

      groups.add(l2Name)

      if (l2ImportKey) {
        importKeys.add(l2ImportKey)
      }

      networkPairs.push({
        name: l1Name,
        group: l2Name,
        l1: { id: l1.id.toString(), name: l1Name },
        l2: {
          id: l2ChainId.toString(),
          name: l2ImportKey || l2CustomImportKey || '',
        },
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
  const customChainImportKeys = Object.values(customChainIdMap).reduce(
    (acc, chainDef) => {
      acc.push(camelCase(chainDef.name))
      return acc
    },
    [] as string[],
  )

  const networkPairsFileContents = eta
    .render('networkPairs', {
      networkPairs,
      networkPairGroups,
      importKeys,
      customChainImportKeys,
    })
    .replace(/&#39;/g, "'")
  fs.writeFileSync(NETWORK_PAIR_FILE_PATH, networkPairsFileContents)
}

async function writeDeploymentAddresses(
  deploymentAddresses: Record<string, DeploymentAddresses>,
) {
  const deploymentAddressesFileContents = eta
    .render('deploymentAddresses', {
      deploymentAddresses,
    })
    .replace(/&quot;/g, "'")
  fs.writeFileSync(
    DEPLOYMENT_ADDRESS_FILE_PATH,
    deploymentAddressesFileContents,
  )
}

async function writeChains() {
  supportedNetworks.forEach((network) => {
    const chains = fs.readdirSync(`${CHAIN_CONFIG}/${network}`)

    chains.forEach((fileName: string) => {
      const chainDef = readYAML<ChainDef>(
        `${CHAIN_CONFIG}/${network}/${fileName}`,
      )

      if (!chainIdMap[chainDef.chain_id] && chainDef.chain_id) {
        customChainIdMap[chainDef.chain_id] = chainDef

        const l1 = allChains[network]
        if (l1) {
          chainDef.source_chain_id = l1.id
        }
      }
    })
  })

  const chainDefs = Object.values(customChainIdMap)
  const chainsFileContents = eta.render('chains', {
    chainDefs,
    camelCase,
  })
  fs.writeFileSync(CHAINS_FILE_PATH, chainsFileContents)
}

async function main() {
  // generate chains not defined in viem
  writeChains()

  // generate network pairs
  const superchains = readJSON<Record<string, bigint>>(SUPERCHAIN_CONFIG)
  const { networkPairs, networkPairGroups, importKeys } =
    createNetworkPairs(superchains)
  writeNetworkPairs(networkPairs, networkPairGroups, importKeys)

  // generate deployment addresses
  const deploymentAddresses = {
    ...readJSON<Record<string, DeploymentAddresses>>(DEPLOYMENT_ADDRESSES),
    ...devnetDeploymentAddresses,
  }
  writeDeploymentAddresses(deploymentAddresses)
}

;(async () => {
  try {
    await main()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(-1)
  }
})()
