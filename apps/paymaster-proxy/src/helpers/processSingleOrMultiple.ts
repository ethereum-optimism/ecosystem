// if input is array, returns result[], otherwise returns result
export const processSingleOrMultiple = async <T, K>(
  maybeArr: T | T[],
  fn: (params: T) => Promise<K>,
): Promise<K | K[]> => {
  if (Array.isArray(maybeArr)) {
    return Promise.all(maybeArr.map(fn))
  }

  return fn(maybeArr)
}
