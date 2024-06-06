import { gql, request } from 'graphql-request'

const easAPIURL = 'https://optimism.easscan.org/graphql'
const schemaID =
  '0x98ef220cd2f94de79fbc343ef982bfa8f5b315dec6a08f413680ecb7085624d7'
const currentTime = Math.floor(Date.now() / 1000)

const GetTempFaucetAccessAttestationQuery = gql`
  query GetTempFaucetAccessAttestationQuery(
    $where: AttestationWhereInput!
    $orderBy: [AttestationOrderByWithRelationInput!]
    $take: Int
  ) {
    attestations(where: $where, orderBy: $orderBy, take: $take) {
      id
    }
  }
`

export const getTempFaucetAccessAttestation = async (
  address: string,
  attestersArray: string[],
) => {
  const result = await request<{
    attestations: Array<{ id: string }>
  }>(easAPIURL, GetTempFaucetAccessAttestationQuery, {
    where: {
      recipient: {
        equals: address,
      },
      schemaId: {
        equals: schemaID,
      },
      revoked: {
        equals: false,
      },
      expirationTime: {
        gt: currentTime,
      },
      attester: {
        in: attestersArray,
      },
    },
    // We will just take the latest attestation to check latest expiry date
    orderBy: [
      {
        timeCreated: 'desc',
      },
    ],
    take: 1,
  })

  if (!result || !result.attestations) {
    throw Error('Graphql query error')
  }

  if (result.attestations.length === 0) {
    // React Query will not accept undefined as a value
    return null
  }

  return {
    id: result.attestations[0].id,
  }
}
