import type { Account, PublicClient } from 'viem'
import { createPublicClient, http, isHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { z } from 'zod'

export type Config = { sender: Account; clients: Record<number, PublicClient> }

export async function parseClientConfig(): Promise<Config> {
  // parse sender
  const senderPrivateKey = process.env['SPONSORED_SENDER_PRIVATE_KEY']
  if (!senderPrivateKey || !isHex(senderPrivateKey)) {
    throw Error('missing or invalid sender private key')
  }

  const sender = privateKeyToAccount(senderPrivateKey)

  // parse endpoints from environment variable
  const endpointsStr = process.env['SPONSORED_SENDER_ENDPOINTS']
  if (!endpointsStr) {
    throw Error('missing SPONSORED_SENDER_ENDPOINTS')
  }

  const endpoints = endpointsStr.split(',').map((url) => url.trim())
  const urlListSchema = z.array(z.string().url())
  const parsedUrls = urlListSchema.safeParse(endpoints)
  if (!parsedUrls.success) {
    throw Error(`invalid endpoints: ${parsedUrls.error.message}`)
  }

  // create clients & validate balances
  const clients: Record<number, PublicClient> = {}
  for (const url of parsedUrls.data) {
    try {
      const client = createPublicClient({ transport: http(url) })
      const chainId = await client.getChainId()
      const balance = await client.getBalance({ address: sender.address })
      if (balance == 0n) {
        throw Error(`zero sender balance: ${chainId}`)
      }

      clients[chainId] = client
    } catch (err) {
      throw Error(`failed endpoint ${url} check: ${err}`)
    }
  }

  if (Object.keys(clients).length === 0) {
    throw Error('no endpoints configured')
  }

  return { sender, clients }
}
