import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

export const getRandomAddress = () => {
  return privateKeyToAccount(generatePrivateKey()).address
}
