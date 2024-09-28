import { GrowthBook, setPolyfills } from '@growthbook/growthbook'
import { webcrypto } from 'crypto'
import eventsource from 'eventsource'
import isomorphicFetch from 'isomorphic-fetch'
import z from 'zod'

import { envVars } from '../constants'

// Growthbook SDK requires some polyfills
setPolyfills({
  fetch: isomorphicFetch,
  EventSource: eventsource,
  SubtleCrypto: webcrypto.subtle,
})

const bool = z.boolean().catch(false)

// there's more than this in our growthbook but we're only concerned with flags we use in the backend
// If you have a new feature flag, add it here
const flags = z.object({
  enable_github_auth: bool,
  enable_faucet_rate_limit: bool,
})

type FeatureFlag = keyof typeof flags.shape

// The SDK recommends instantiating this as a middleware
// Instantiating it as a middleware allows you to save context per request,
// ie. for running UX A/B testing.
//
// But we're not using it for that purpose, and we're okay with feature flags that get shared
// across all requests which is why we're instantiating it as a singleton.
// Benefit of this is that we can easily use it in non-express handler code
// & plays well with our dependency injection pattern

export class GrowthbookStore {
  constructor(
    private readonly _growthbook: GrowthBook<z.infer<typeof flags>>,
  ) {}

  static async create() {
    const growthbook = new GrowthBook({
      apiHost: 'https://cdn.growthbook.io',
      clientKey: envVars.GROWTHBOOK_CLIENT_KEY,
      decryptionKey: envVars.GROWTHBOOK_ENCRYPTION_KEY,
    })
    // Growthbook in general does not throw, instead just returning default values if fetch fails
    await growthbook.loadFeatures({ autoRefresh: true })
    return new GrowthbookStore(growthbook)
  }

  // returns typesafe feature flag value
  get = <T extends FeatureFlag>(key: T): z.infer<(typeof flags.shape)[T]> => {
    const parser = flags.shape[key]
    return parser.parse(
      // returns default value if feature flag is not found
      // parser.parse(null) triggers the catch(false) in the zod schema
      this._growthbook.getFeatureValue(key, parser.parse(null)),
    )
  }
}
