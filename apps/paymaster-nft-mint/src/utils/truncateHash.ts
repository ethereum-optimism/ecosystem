import { Hex } from 'viem'

export const truncateHash = (hash: Hex) => {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`
}
