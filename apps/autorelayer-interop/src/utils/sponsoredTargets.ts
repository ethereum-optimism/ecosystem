import type { Address } from 'viem'

export type SponsoredTarget = {
  address: Address
  chainId: bigint
}

/**
 * Converts sponsored targets to the format expected by the API
 * @param sponsoredTargets - Array of sponsored targets
 * @returns JSON string ready for URL parameters
 */
export function serializeSponsoredTargets(
  sponsoredTargets: SponsoredTarget[],
): string {
  return JSON.stringify(
    sponsoredTargets.map((target) => ({
      address: target.address,
      chainId: target.chainId.toString(),
    })),
  )
}
