import { App } from '@eth-optimism/utils-app'
import { Option } from 'commander'
import type { Hex, PublicClient, WalletClient } from 'viem'
import { createPublicClient, createWalletClient, http, isHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { z } from 'zod'

import { Relayer } from '@/relayer.js'
import { jsonFetchParams } from '@/utils/jsonFetchParams.js'

const ChainSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
  }),
)

const ConfigSchema = z.object({
  loopIntervalMs: z.number().min(2000),
  interopPonderApiUrl: z.string().url(),
  sponsoredEndpoint: z.string().url(),
  senderPrivateKey: z
    .string()
    .optional()
    .refine((key) => {
      if (!key) return true
      return isHex(key) && privateKeyToAccount(key) !== undefined
    }, 'private key must be a valid hex string'),
})

type Chains = z.infer<typeof ChainSchema>

class RelayerApp extends App {
  private relayer!: Relayer

  constructor() {
    super({
      name: 'autorelayer-interop',
      version: '0.0.1',
      description: 'autorelay l2-to-l2 interop txs',
    })
  }

  protected additionalOptions(): Option[] {
    return [
      new Option('--loop-interval-ms <ms>', 'interval to run the relayer')
        .default(4000)
        .env('LOOP_INTERVAL_MS'),
      new Option(
        '--interop-ponder-api-url <url>',
        'url to the interop ponder api',
      )
        .default('http://127.0.0.1:42069')
        .env('INTEORP_PONDER_API_URL'),
      new Option(
        '--sponsored-endpoint <url>',
        'sponsored endpoint to use for the relayer',
      ).default('http://127.0.0.1:3000'),
      new Option(
        '--sender-private-key <key>',
        'local private key to use for the relayer',
      ).conflicts('sponsoredEndpoint'),
    ]
  }

  protected async preMain(): Promise<void> {
    // validate options
    const { data: config, error } = ConfigSchema.safeParse(this.options)
    if (error) {
      throw new Error(`invalid configuration: ${error}`)
    }

    // Fetch chains for the interop api
    let chains: Chains
    try {
      const url = `${config.interopPonderApiUrl}/chains`
      this.logger.debug('fetching chain config from %s', url)

      const resp = await fetch(url, jsonFetchParams)
      if (!resp.ok) {
        throw new Error(`invalid response: ${resp.statusText}`)
      }

      const body = await resp.json()
      const { data, error } = ChainSchema.safeParse(body)
      if (error) {
        throw new Error(`failed parsing api response: ${error}`)
      }

      chains = data
      if (chains.length === 0) throw new Error('no chains found')
    } catch (error) {
      throw new Error(`failed to fetch chains: ${error}`)
    }

    // Setup Clients
    const clients: Record<number, PublicClient> = {}
    const walletClients: Record<number, WalletClient> = {}
    for (const chain of chains) {
      this.logger.debug('configuring clients for chain %d', chain.id)

      const transport = http(chain.url)
      const client = createPublicClient({ transport })
      clients[chain.id] = client

      // If Local, setup the account
      if (config.senderPrivateKey) {
        const account = privateKeyToAccount(config.senderPrivateKey as Hex)
        walletClients[chain.id] = createWalletClient({ account, transport })
        this.logger.debug('configured sender %s', account.address)
      }

      // If Sponsored, setup the wallet client on the endpoint
      if (!config.senderPrivateKey && config.sponsoredEndpoint) {
        const url = `${config.sponsoredEndpoint}/${chain.id}`
        const walletClient = createWalletClient({ transport: http(url) })
        walletClients[chain.id] = walletClient
        this.logger.debug('configured sponsored endpoint %s', url)
      }
    }

    // Setup the relayer
    this.relayer = new Relayer(this.logger, {
      interopPonderApiUrl: config.interopPonderApiUrl,
      clients,
      walletClients,
    })
  }

  protected async main(): Promise<void> {
    this.logger.info(
      'starting worker on interval: (%dms)',
      this.options.loopIntervalMs,
    )

    while (true) {
      try {
        await this.relayer.run()
      } catch (error) {
        this.logger.error({ error }, 'failed run')
      }

      await new Promise((resolve) =>
        setTimeout(resolve, this.options.loopIntervalMs),
      )
    }
  }

  protected async shutdown(): Promise<void> {
    this.logger.info('shutting down...')
    // clear interval
  }
}

await new RelayerApp().run()
