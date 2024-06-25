import { Authentications } from '@/app/faucet/types'

export const hasAuthentication = (authentications: Authentications) => {
  return Object.values(authentications).some((auth) => auth)
}

export const getOnchainAuthentication = (authentications: Authentications) => {
  // Checks if the user has any onchain authentications in the order of priority
  if (authentications.COINBASE_VERIFICATION) {
    return 'COINBASE_VERIFICATION'
  } else if (authentications.ATTESTATION) {
    return 'ATTESTATION'
  } else if (authentications.GITCOIN_PASSPORT) {
    return 'GITCOIN_PASSPORT'
  }
}

export const generateClaimSignature = (
  ownerAddress: string,
  recipientAddress: string,
) => {
  return `You need to sign a message to prove you are the owner of ${ownerAddress} and are sending testnet tokens to ${recipientAddress}`
}
