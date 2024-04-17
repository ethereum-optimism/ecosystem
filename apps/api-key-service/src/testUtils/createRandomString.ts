import crypto from 'crypto'

export const createRandomString = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from(
    crypto.getRandomValues(new Uint32Array(length)),
    (value) => chars[value % chars.length],
  ).join('')
}
