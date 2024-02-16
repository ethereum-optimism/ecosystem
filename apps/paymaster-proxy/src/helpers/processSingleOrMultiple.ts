// if input is array, returns result[], otherwise returns result
export const processSingleOrMultiple = async <T, K>(
  maybeArr: T | T[],
  fn: (params: T) => Promise<K>,
): Promise<K | K[]> => {
  return Array.isArray(maybeArr) ? Promise.all(maybeArr.map(fn)) : fn(maybeArr)
}
