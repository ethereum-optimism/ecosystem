export const retryWithBackoff = <T>(
  operation: () => Promise<T>,
  maxRetries: number,
  initialDelayMs: number,
  maxDelayMs: number,
) => {
  return new Promise<T>(async (resolve, reject) => {
    let currentDelay = initialDelayMs
    let retryCount = 0

    async function attempt() {
      try {
        const result = await operation()
        resolve(result)
      } catch (error: any) {
        retryCount++

        if (retryCount <= maxRetries) {
          console.error(
            `${operation.name}: attempt ${retryCount} failed. Retrying in ${currentDelay}ms. Error: ${error.message}`,
          )
          setTimeout(attempt, currentDelay)
          currentDelay = Math.min(currentDelay * 2, maxDelayMs)
        } else {
          console.error(
            `${operation.name}: max retries reached. Last error: ${error.message}`,
          )
          reject(error)
        }
      }
    }

    attempt()
  })
}
