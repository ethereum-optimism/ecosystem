import { z } from 'zod'

import { generateListResponse, zodListRequest, zodNameCursor } from '@/api'
import { envVars } from '@/constants'
import { isPrivyAuthed } from '@/middleware'
import {
  AppState,
  deleteAllContractsInApp,
  deleteApp,
  getActiveAppsCount,
  getActiveAppsForEntityByCursor,
  insertApp,
  updateApp,
} from '@/models'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'
import { addRebateEligibilityToContract } from '@/utils'

import { DEFAULT_PAGE_LIMIT } from '../constants'
import { Route } from '../Route'
import { assertUserAuthenticated } from '../utils'

const zodAppName = z.string().min(1).max(120)

export class AppsRoute extends Route {
  public readonly name = 'apps' as const

  public readonly listApps = 'listApps' as const
  /**
   * Returns a list of apps associated with the entity.
   */
  public readonly listAppsController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(zodListRequest(zodNameCursor))
    .query(async ({ ctx, input }) => {
      try {
        const { user } = ctx.session
        const limit = input.limit ?? DEFAULT_PAGE_LIMIT

        const { id: entityId } = await assertUserAuthenticated(
          this.trpc.database,
          user,
        )

        const activeApps = await getActiveAppsForEntityByCursor({
          db: this.trpc.database,
          entityId,
          limit,
          cursor: input.cursor,
        })

        const activeAppsWithRebateEligiblity = activeApps.map((app) => ({
          ...app,
          contracts: app.contracts.map((contract) =>
            addRebateEligibilityToContract({
              ...contract,
              entity: app.entity,
            }),
          ),
        }))

        return generateListResponse(
          activeAppsWithRebateEligiblity,
          limit,
          input.cursor,
        )
      } catch (err) {
        metrics.listAppsErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: ctx.session.user?.entityId,
            privyDid: ctx.session.user?.privyDid,
          },
          'error fetching apps from db',
        )
        throw Trpc.handleStatus(500, 'error fetching apps')
      }
    })

  public readonly createApp = 'createApp' as const
  public readonly createAppController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z.object({
        name: zodAppName,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session
      const { name } = input

      const { id: entityId } = await assertUserAuthenticated(
        this.trpc.database,
        user,
      )

      const activeAppsCount = await getActiveAppsCount({
        db: this.trpc.database,
        entityId,
      }).catch((err) => {
        metrics.fetchActiveAppsCountErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId,
          },
          'error fetching active apps count from db',
        )
        throw Trpc.handleStatus(500, 'unable to fetch active app count')
      })

      if (activeAppsCount >= envVars.MAX_APPS_COUNT) {
        throw Trpc.handleStatus(422, 'max apps reached')
      }

      const result = await insertApp({
        db: this.trpc.database,
        newApp: { name, entityId, state: AppState.ACTIVE },
      }).catch((err) => {
        metrics.createAppErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: ctx.session.user?.entityId,
          },
          'error inserting app in db',
        )
        throw Trpc.handleStatus(500, 'unable to create app')
      })

      return { result }
    })

  public readonly editApp = 'editApp' as const
  public readonly editAppController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z.object({
        appId: this.z.string(),
        name: zodAppName,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session
      const { name, appId } = input

      const { id: entityId } = await assertUserAuthenticated(
        this.trpc.database,
        user,
      )

      await updateApp({
        db: this.trpc.database,
        entityId,
        appId,
        update: { name },
      }).catch((err) => {
        metrics.editAppErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: ctx.session.user?.entityId,
            appId,
            newName: name,
          },
          'error updating app in db',
        )
        throw Trpc.handleStatus(500, 'unable to edit app')
      })

      return { success: true }
    })

  public readonly deleteAppEndpoint = 'deleteApp' as const
  public readonly deleteAppController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z.object({
        appId: this.z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session
      const { appId } = input

      const { id: entityId } = await assertUserAuthenticated(
        this.trpc.database,
        user,
      )

      await this.trpc.database.transaction(async (tx) => {
        await deleteApp({
          db: tx,
          entityId,
          appId,
        }).catch((err) => {
          metrics.deleteAppErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId,
              appId,
            },
            'error deleting app in db',
          )
          throw Trpc.handleStatus(500, 'unable to delete app')
        })

        await deleteAllContractsInApp({
          db: tx,
          entityId,
          appId,
        }).catch((err) => {
          metrics.deleteContractsInAppErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId,
              appId,
            },
            'error deleting all contracts from app in db',
          )
          throw Trpc.handleStatus(500, 'unable to delete app')
        })
      })

      return { success: true }
    })

  public readonly handler = this.trpc.router({
    [this.listApps]: this.listAppsController,
    [this.createApp]: this.createAppController,
    [this.editApp]: this.editAppController,
    [this.deleteAppEndpoint]: this.deleteAppController,
  })
}
