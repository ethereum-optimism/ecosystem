import { screenAddress } from '@eth-optimism/screening'
import type { Address } from 'viem'

import { envVars } from '@/constants'
import type { Database } from '@/db'
import type { Entity } from '@/models'
import { sanctionEntity } from '@/models'
import { metrics } from '@/monitoring/metrics'

/**
 * Checks if the provided address is sanctioned.
 *
 * If sanctioned, then marks the entity as sanctioned and returns true.
 */
export const checkIfSanctionedAddress = async (input: {
  db: Database
  address: Address
  entityId: Entity['id']
}) => {
  if (!envVars.PERFORM_ADDRESS_SCREENING) {
    return false
  }

  const { db, address, entityId } = input
  const isSanctioned = await screenAddress(
    envVars.SCREENING_SERVICE_URL,
    address,
  ).catch((err) => {
    metrics.screeningServiceCallErrorCount.inc()
    throw err
  })
  if (isSanctioned) {
    await sanctionEntity({ db, entityId, sanctionedAddress: address }).catch(
      (err) => {
        metrics.sanctionEntityErrorCount.inc()
        throw err
      },
    )
    metrics.sanctionedAddressBlocked.inc({ entityId })
  }
  return isSanctioned
}
