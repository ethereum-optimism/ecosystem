export type Authentications = {
  COINBASE_VERIFICATION: boolean | undefined
  ATTESTATION: boolean | undefined
  GITCOIN_PASSPORT: boolean | undefined
  WORLD_ID: boolean | undefined
}

export type AuthMode =
  | 'COINBASE_VERIFICATION'
  | 'ATTESTATION'
  | 'GITCOIN_PASSPORT'
  | 'WORLD_ID'
  | 'PRIVY'

export type ClaimStatus = 'successful' | 'initiated' | 'failed' | null
