import crypto from 'crypto'
import { bytesToHex } from 'viem'

export const getRandomNonceHex = () => {
  return bytesToHex(new Uint8Array(crypto.randomBytes(32).buffer))
}
