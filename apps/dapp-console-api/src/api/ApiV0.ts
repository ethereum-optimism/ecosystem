import type { AuthRoute } from '@/routes/auth'
import type { WalletsRoute } from '@/routes/wallets'
import type { DeploymentRoute } from '@/routes/Deployments'

import { MajorApiVersion } from '../constants'
import type { Trpc } from '../Trpc'
import { Api } from './Api'

export class ApiV0 extends Api {
  public readonly name = 'ApiV0'

  public readonly majorVersion = MajorApiVersion.V0
  public readonly minorVersion = 0

  public readonly handler = this.trpc.router({
    /**
     * @important
     * READ THIS BEFORE MAKING A BREAKING CHANGE
     * @important
     * Consider bumping minor version if you add a new route or non-breaking functionality to an existing route
     * @important
     * If you need to make a major version bump:
     *
     * 0. consider not doing that but if you really want to...
     * 1. copy paste this file into ApiV1.ts and update MajorApiVersion to have V1
     * 2. keep the old route in ApiV0.ts
     * 3. pass in your new route in ApiV0.ts
     * 4. add both V0 and V1 to Service.ts
     * 5. update frontend to use new API by changing MajorApiVersion.LATEST to MajorApiVersion.V1
     *
     * from time to time we will delete old api versions if they are no longer used
     */
    ...this.commonRoutes,
    [this.routes.authRoute.name]: this.routes.authRoute.handler,
    [this.routes.walletsRoute.name]: this.routes.walletsRoute.handler,
    [this.routes.deploymentRoute.name]: this.routes.deploymentRoute.handler,
  })

  /**
   * @param trpc - instance of trpc utility
   */
  constructor(
    trpc: Trpc,
    protected readonly routes: {
      authRoute: AuthRoute
      walletsRoute: WalletsRoute
      deploymentRoute: DeploymentRoute
    },
  ) {
    super(trpc)
  }
}
