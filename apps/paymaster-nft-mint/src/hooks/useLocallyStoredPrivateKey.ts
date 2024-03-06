import { useLocalStorage } from '@uidotdev/usehooks'
import { Hex } from 'viem'
import { generatePrivateKey } from 'viem/accounts'

const LOCAL_STORAGE_KEY = 'paymaster-nft-mint-example-signer-private-key-2'

// Hook for getting a private key saved locally
// Don't do this in practice, this is just for the example
export const useLocallyStoredPrivateKey = () => {
  const [privateKey] = useLocalStorage<Hex>(
    LOCAL_STORAGE_KEY,
    generatePrivateKey(), // generate one if one doesn't already exist
  )

  return privateKey
}
