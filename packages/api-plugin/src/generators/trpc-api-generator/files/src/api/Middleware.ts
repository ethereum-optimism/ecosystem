import cors from 'cors'

/**
 * All middleware used in servers
 */
export class Middleware {
  /**
   * Cors middleware for express
   * @example
   * app.use(new Middleware().cors)
   */
  public readonly cors = cors({
    credentials: true,
    origin: (origin, callback) => {
      const isAllowed =
        !origin || this.corsAllowlist.some((item) => item.test(origin))
      const error = isAllowed
        ? null
        : new Error(`${origin} not allowed by cors`)
      callback(error, isAllowed)
    },
  })

  // TODO add cookie middleware

  /**
   * @param corsAllowlist - regex array of allowlist
   */
  constructor(private readonly corsAllowlist: RegExp[]) {}
}
