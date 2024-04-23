export const shortenENSName = (
  str: string,
  maxLength: number | undefined = 13,
) => {
  if (str.length <= maxLength) {
    return str
  }

  const lastDot = str.lastIndexOf('.')

  if (lastDot < 0) {
    throw new TypeError('Invalid input, not a valid domain')
  }

  const nonTld = str.slice(0, lastDot)
  const tld = str.slice(lastDot + 1)

  return `${nonTld.slice(0, 3)}...${nonTld.slice(-3)}.${tld}`
}

export function shortenHex(str: string) {
  return str.substring(0, 6) + '...' + str.substring(str.length - 4)
}

export const shortenAddress = (address: string) => {
  return address.includes('.') ? shortenENSName(address) : shortenHex(address)
}
