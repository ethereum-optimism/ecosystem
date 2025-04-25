import type { Logger } from 'pino'
import type { Hex, PublicClient, WalletClient } from 'viem'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { z } from 'zod'

import { jsonFetchParams } from '@/utils/jsonFetchParams.js'

export type Config = {
  loopIntervalMs: number
  apiUrl: string

  clients: Record<number, PublicClient>
  submissionClients: Record<number, WalletClient>
}

const chainSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
  }),
)

type Chains = z.infer<typeof chainSchema>

/**
 * Parse config from the environment.
 * @param log - The logger.
 * @returns The config {@link Config}.
 */
export async function parseConfig(log: Logger): Promise<Config> {
  // parse loop interval
  let loopIntervalMsStr = process.env['AUTORELAYER_LOOP_INTERVAL_MS']
  if (!loopIntervalMsStr) {
    log.warn('AUTORELAYER_LOOP_INTERVAL_MS is not set. using default 6s')
    loopIntervalMsStr = '6000'
  }

  const loopIntervalMs = parseInt(loopIntervalMsStr)
  if (isNaN(loopIntervalMs)) {
    throw new Error('AUTORELAYER_LOOP_INTERVAL_MS is not a number')
  }

  // parse the relaying private key or use the sponsored endpoint
  const senderPrivateKey = process.env['AUTORELAYER_PRIVATE_KEY']
  const sponsoredEndpoint = process.env['AUTORELAYER_SPONSORED_ENDPOINT']
  if (sponsoredEndpoint && senderPrivateKey) {
    throw new Error(
      'AUTORELAYER_SPONSORED_ENDPOINT and AUTORELAYER_PRIVATE_KEY are both set.',
    )
  }
  if (!senderPrivateKey && !sponsoredEndpoint) {
    throw new Error(
      'either AUTORELAYER_PRIVATE_KEY or AUTORELAYER_SPONSORED_ENDPOINT must be set.',
    )
  }

  // parse ponder api url
  let apiUrl = process.env['AUTORELAYER_PONDER_API_URL']
  if (!apiUrl) {
    log.warn('AUTORELAYER_PONDER_API_URL is not set. using default :42069')
    apiUrl = 'http://127.0.0.1:42069'
  }

  // fetch interoperable endpoints from the api
  let chains: Chains
  try {
    const url = `${apiUrl}/chains`
    const resp = await fetch(url, jsonFetchParams)
    if (!resp.ok) {
      throw new Error(`invalid response: ${resp.statusText}`)
    }

    const body = await resp.json()
    const result = chainSchema.safeParse(body)
    if (!result.success) {
      throw new Error(`failed parsing api response: ${result.error.format()}`)
    }

    chains = result.data
    if (chains.length === 0) throw new Error('no chains found')
  } catch (err) {
    throw new Error(`failed to query chains: ${err}`)
  }

  const clients: Record<number, PublicClient> = {}
  const submissionClients: Record<number, WalletClient> = {}
  for (const chain of chains) {
    log.debug('configuring clients for chain %d', chain.id)

    const transport = http(chain.url)
    const client = createPublicClient({ transport })
    clients[chain.id] = client

    // Either Local / Sponsored.

    if (senderPrivateKey) {
      const account = privateKeyToAccount(senderPrivateKey as Hex)
      submissionClients[chain.id] = createWalletClient({ account, transport })
      log.debug('configured sender %s', account.address)
    }

    if (sponsoredEndpoint) {
      const url = `${sponsoredEndpoint}/${chain.id}`
      const walletClient = createWalletClient({ transport: http(url) })
      submissionClients[chain.id] = walletClient
    }
  }

  return { loopIntervalMs, apiUrl, clients, submissionClients }
}
