import type { RelayerConfig } from '@/config/relayerConfig.js'
import {
  PendingMessagesSchema,
  PendingMessagesWithGasTankSchema,
} from '@/schemas/index.js'
import type {
  PendingMessages,
  PendingMessagesWithGasTank,
} from '@/types/index.js'
import { jsonFetchParams } from '@/utils/jsonFetchParams.js'
import { serializeSponsoredTargets } from '@/utils/sponsoredTargets.js'
import { formatZodError } from '@/utils/zodHelpers.js'

export async function fetchSponsoredMessages({
  sponsoredTargets,
  ponderInteropApi,
}: {
  sponsoredTargets: RelayerConfig['sponsoredTargets']
  ponderInteropApi: string
}): Promise<PendingMessages> {
  if (!sponsoredTargets || sponsoredTargets.length === 0) {
    return []
  }

  const url = new URL(`${ponderInteropApi}/messages/pending`)
  url.searchParams.set(
    'filteredTargets',
    serializeSponsoredTargets(sponsoredTargets),
  )

  const resp = await fetch(url, jsonFetchParams)
  if (!resp.ok) {
    throw new Error(`http response: ${resp.statusText}`)
  }

  const body = await resp.json()
  const { data: msgs, error } = PendingMessagesSchema.safeParse(body)
  if (error) {
    throw new Error(`api response: ${formatZodError(error)}`)
  }
  return msgs
}

export async function fetchPendingMessagesWithGasTankFunds({
  sponsoredTargets,
  ponderInteropApi,
}: {
  sponsoredTargets: RelayerConfig['sponsoredTargets']
  ponderInteropApi: string
}): Promise<PendingMessagesWithGasTank> {
  const url = new URL(`${ponderInteropApi}/messages/pending/gas-tank`)
  if (sponsoredTargets) {
    url.searchParams.set(
      'excludedTargets',
      serializeSponsoredTargets(sponsoredTargets),
    )
  }

  const resp = await fetch(url, jsonFetchParams)
  if (!resp.ok) {
    throw new Error(`http response: ${resp.statusText}`)
  }

  const body = await resp.json()
  const { data: msgs, error } = PendingMessagesWithGasTankSchema.safeParse(body)
  if (error) {
    throw new Error(`api response: ${formatZodError(error)}`)
  }
  return msgs
}
