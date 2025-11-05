import 'dotenv/config'

import toml from '@iarna/toml'
import { Eta } from 'eta'
import fs from 'fs'
import path from 'path'
import type { Address, PublicClient } from 'viem'
import { createPublicClient, erc20Abi, http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

// Hardcoded. Can take a more elaborate approach if needed.
const NETWORKS: Array<'mainnet' | 'sepolia'> = ['mainnet', 'sepolia']
const SUPERCHAIN_REGISTRY_PATH = path.join(
  '..',
  '..',
  'lib',
  'superchain-registry',
)

type ChainDefinition = {
  chainName: string
  exportName: string
  chainId: number
  sourceChainId: number
  rpc: string
  explorer: string
  nativeCurrency: NativeCurrency
  l1Addresses: Record<string, Address>
}

type NativeCurrency = { name: string; symbol: string; decimals: number }

/** Utility functions **/

function camelCase(str: string): string {
  const parts = str.replace(/-/g, ' ').replace(/_/g, ' ').split(' ')
  return (
    parts[0].toLowerCase() +
    parts
      .slice(1)
      .map((part) => part[0].toUpperCase() + part.substring(1))
      .join('')
  )
}

function pascalCase(name: string): string {
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => {
      if (word === 'op') {
        return 'OP' // keep OP capitalized
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
    .trim()
}

async function nativeCurrency(
  client: PublicClient,
  address: Address | undefined,
): Promise<NativeCurrency> {
  if (!address) {
    return { name: 'Ether', symbol: 'ETH', decimals: 18 }
  }

  const [name, symbol, decimals] = await Promise.all([
    client.readContract({ address, abi: erc20Abi, functionName: 'name' }),
    client.readContract({ address, abi: erc20Abi, functionName: 'symbol' }),
    client.readContract({ address, abi: erc20Abi, functionName: 'decimals' }),
  ])

  return { name, symbol, decimals }
}

/** Chain Generation **/

async function main() {
  // eslint-disable-next-line no-console
  console.log('Running chain generation...')
  const eta = new Eta({
    views: './scripts/templates',
    debug: true,
    autoTrim: [false, false],
  })

  // Load addresses.json for additional address data
  const addressesJsonPath = path.join(
    SUPERCHAIN_REGISTRY_PATH,
    'superchain',
    'extra',
    'addresses',
    'addresses.json',
  )
  const addressesData = JSON.parse(
    fs.readFileSync(addressesJsonPath, 'utf8'),
  ) as Record<string, Record<string, Address>>

  const mainnetHttp = process.env.MAINNET_RPC_URL
    ? [process.env.MAINNET_RPC_URL]
    : mainnet.rpcUrls.default.http
  const mainnetClient = createPublicClient({
    chain: { ...mainnet, rpcUrls: { default: { http: mainnetHttp } } },
    transport: http(),
  })

  const sepoliaHttp = process.env.SEPOLIA_RPC_URL
    ? [process.env.SEPOLIA_RPC_URL]
    : sepolia.rpcUrls.default.http
  const sepoliaClient = createPublicClient({
    chain: { ...sepolia, rpcUrls: { default: { http: sepoliaHttp } } },
    transport: http(),
  })

  for (const network of NETWORKS) {
    // eslint-disable-next-line no-console
    console.log(`Generating ${network}`)
    const client = network === 'mainnet' ? mainnetClient : sepoliaClient
    const sourceChainId = network === 'mainnet' ? 1 : 11155111
    const sourceChainImport = `viemChains.${network}`

    const configPath = path.join(
      SUPERCHAIN_REGISTRY_PATH,
      'superchain',
      'configs',
      network,
    )

    // `superchain.toml` contains information on activation times as well as the
    // applicable l1 contracts for the chain. We exclude this file as a chain entry
    const entries = fs
      .readdirSync(configPath)
      .filter((entry) => !entry.includes('superchain'))

    const chainDefs = await Promise.all(
      entries.map(async (entry) => {
        const chainConfig = toml.parse(
          fs.readFileSync(`${configPath}/${entry}`, 'utf8'),
        )

        const chainId = chainConfig.chain_id as number
        const tomlAddresses =
          (chainConfig.addresses as Record<string, Address>) || {}

        const jsonAddresses = addressesData[chainId.toString()] || {}

        // Merge addresses, prioritizing TOML
        const allAddresses = { ...jsonAddresses, ...tomlAddresses }

        const l1Addresses: Record<string, Address> = {}

        // Referenced as `portal` in viem
        if (allAddresses.OptimismPortalProxy) {
          l1Addresses['portal'] = allAddresses.OptimismPortalProxy
        }

        // Standard Deployments
        if (allAddresses.L1StandardBridgeProxy) {
          l1Addresses['l1StandardBridge'] = allAddresses.L1StandardBridgeProxy
        }
        if (allAddresses.L1ERC721BridgeProxy) {
          l1Addresses['l1Erc721Bridge'] = allAddresses.L1ERC721BridgeProxy
        }
        if (allAddresses.L1CrossDomainMessengerProxy) {
          l1Addresses['l1CrossDomainMessenger'] =
            allAddresses.L1CrossDomainMessengerProxy
        }
        if (allAddresses.SystemConfigProxy) {
          l1Addresses['systemConfig'] = allAddresses.SystemConfigProxy
        }

        if (allAddresses.DisputeGameFactoryProxy) {
          l1Addresses['disputeGameFactory'] =
            allAddresses.DisputeGameFactoryProxy
        }
        if (allAddresses.L2OutputOracleProxy) {
          l1Addresses['l2OutputOracle'] = allAddresses.L2OutputOracleProxy
        }

        // This is an edge case handler for the `arena-z-testnet` chain name.
        const normalizedEntryName = entry
          .replace('.toml', '')
          .replace('-testnet', '')

        // Apply a suffix if a network other than mainnet
        const exportName =
          network === 'mainnet'
            ? normalizedEntryName
            : `${normalizedEntryName}-${network}`

        // Remove the network and any hyphens
        const normalizedChainName = (chainConfig.name as string)
          .toLowerCase()
          .replace(/(testnet|mainnet|sepolia)/gi, '')
          .replace(/(-)/gi, ' ')
          .trim()

        // Apply a suffix if other than mainnet (other than OP)
        const chainName =
          network === 'mainnet' && normalizedChainName !== 'op'
            ? normalizedChainName
            : `${normalizedChainName} ${network}`

        return {
          chainName: pascalCase(chainName),
          exportName: camelCase(exportName),
          chainId: chainId,
          sourceChainId: sourceChainId,
          rpc: chainConfig.public_rpc as string,
          explorer: chainConfig.explorer as string,
          nativeCurrency: await nativeCurrency(
            client,
            chainConfig.gas_paying_token as Address,
          ),
          l1Addresses,
        } satisfies ChainDefinition
      }),
    )

    const fileContents = eta.render('chains', {
      chainDefs,
      network,
      sourceChainImport,
    })

    // eslint-disable-next-line no-console
    console.log(`Writing chains to file...`)
    fs.writeFileSync(`src/chains/${network}.ts`, fileContents)
  }
}

;(async () => {
  try {
    await main()
    process.exit(0)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    process.exit(-1)
  }
})()
