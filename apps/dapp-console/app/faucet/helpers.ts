import { Authentications } from '@/app/faucet/types'

export const hasAuthentication = (authentications: Authentications) => {
  return Object.values(authentications).some((auth) => auth)
}

export const getOnchainAuthentication = (authentications: Authentications) => {
  if (authentications.COINBASE_VERIFICATION) {
    return 'COINBASE_VERIFICATION'
  } else if (authentications.GITCOIN_PASSPORT) {
    return 'GITCOIN_PASSPORT'
  } else if (authentications.ATTESTATION) {
    return 'ATTESTATION'
  }
}

export const generateClaimSignature = (
  ownerAddress: string,
  recipientAddress: string,
) => {
  return `You need to sign a message to prove you are the owner of ${ownerAddress} and are sending testnet tokens to ${recipientAddress}`
}
