import type { Address } from 'viem'

export const generateChallenge = (address: Address) => {
  return `I verify that I am the owner of ${address}, and I'm an optimist`
}
