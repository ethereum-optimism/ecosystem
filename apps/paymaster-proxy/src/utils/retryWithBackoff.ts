export const retryWithBackoff = <T>({
  fn,
  maxRetries,
  initialDelayMs,
  maxDelayMs,
  onRetry = () => {},
}: {
  fn: () => Promise<T>
  maxRetries: number
  initialDelayMs: number
  maxDelayMs: number
  onRetry: (retryCount: number, error: Error) => void
}) => {
  return new Promise<T>(async (resolve, reject) => {
    let currentDelay = initialDelayMs
    let retryCount = 0

    async function attempt() {
      try {
        const result = await fn()
        resolve(result)
      } catch (error: any) {
        retryCount++

        if (retryCount <= maxRetries) {
          onRetry(retryCount, error)
          setTimeout(attempt, currentDelay)
          currentDelay = Math.min(currentDelay * 2, maxDelayMs)
        } else {
          reject(error)
        }
      }
    }

    attempt()
  })
}
