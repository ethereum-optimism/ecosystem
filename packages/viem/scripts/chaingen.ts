import toml from '@iarna/toml'
import { Eta } from 'eta'
import fs from 'fs'
import path from 'path'
import type { Address, PublicClient } from 'viem'
import { createPublicClient, erc20Abi, http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

// Hardcoded. Can take a more elaborate approach if needed.
const NETWORKS = ['mainnet', 'sepolia']
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
  console.log('Running chain generation...')
  const eta = new Eta({
    views: './scripts/templates',
    debug: true,
    autoTrim: [false, false],
  })

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
    console.log(`Generating ${network}`)
    const client = network === 'mainnet' ? mainnetClient : sepoliaClient

    const configPath = path.join(
      SUPERCHAIN_REGISTRY_PATH,
      'superchain',
      'configs',
      network,
    )
    const entries = fs
      .readdirSync(configPath)
      .filter((entry) => !entry.includes('superchain'))
    const chainDefs = await Promise.all(
      entries.map(async (entry) => {
        const chainConfig = toml.parse(
          fs.readFileSync(`${configPath}/${entry}`, 'utf8'),
        )

        const addresses = chainConfig.addresses as Record<string, Address>
        const l1Addresses = {
          // Referenced as `portal` in viem
          portal: addresses.OptimismPortalProxy,

          // Standard Deployments
          l1StandardBridge: addresses.L1StandardBridgeProxy,
          l1Erc721Bridge: addresses.L1ERC721BridgeProxy,
          l1CrossDomainMessenger: addresses.L1CrossDomainMessengerProxy,
          systemConfig: addresses.SystemConfigProxy,
        }

        if (addresses.DisputeGameFactoryProxy) {
          l1Addresses['disputeGameFactory'] = addresses.DisputeGameFactoryProxy
        }
        if (addresses.L2OutputOracleProxy) {
          l1Addresses['l2OutputOracle'] = addresses.L2OutputOracleProxy
        }

        const normalizedName = entry
          .replace('.toml', '')
          .replace('-testnet', '')
        return {
          chainName: chainConfig.name as string,
          exportName: camelCase(`${normalizedName}-${network}`),
          chainId: chainConfig.chain_id as number,
          sourceChainId: network === 'mainnet' ? 1 : 11155111,
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

    const fileContents = eta.render('chains', { chainDefs, network })

    console.log(`Writing chains to file...`)
    fs.writeFileSync(`src/chains/${network}.ts`, fileContents)
  }
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
