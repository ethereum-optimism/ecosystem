import type { SessionData } from '@/constants'
import type { Database } from '@/db'
import type { Entity } from '@/models'
import { EntityState, getEntityByEntityId } from '@/models'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'

export async function assertUserAuthenticated(
  db: Database,
  user: SessionData['user'],
): Promise<Entity> {
  if (!user) {
    throw Trpc.handleStatus(401, 'user not authenticated')
  }

  const entity = await getEntityByEntityId({
    db,
    entityId: user.entityId,
  }).catch(() => {
    metrics.fetchEntityErrorCount.inc()
    throw Trpc.handleStatus(500, 'unable to fetch entity')
  })

  if (!entity) {
    throw Trpc.handleStatus(401, 'entity not found')
  }

  if (entity.state === EntityState.SANCTIONED) {
    metrics.sanctionedAddressBlocked.inc({ entityId: entity.id })
    throw Trpc.handleStatus(401, 'sanctioned entity')
  }

  return entity
}
