import { gql, request } from 'graphql-request'
import { isHex } from 'viem'
import { z } from 'zod'

const easAPIURL = 'https://optimism.easscan.org/graphql'
const schemaID =
  '0x6ab5d34260fca0cfcf0e76e96d439cace6aa7c3c019d7c4580ed52c6845e9c89'

// This parses the decoded json blob from the attestation
const gitcoinPassportAttestationDataSchema = z
  .tuple([
    z.object({
      name: z.literal('score'),
      type: z.literal('uint256'),
      signature: z.literal('uint256 score'),
      value: z.object({
        name: z.literal('score'),
        type: z.literal('uint256'),
        value: z.object({
          type: z.literal('BigNumber'),
          hex: z.string().startsWith('0x').refine(isHex),
        }),
      }),
    }),

    z.object({
      name: z.literal('scorer_id'),
      type: z.literal('uint32'),
      signature: z.literal('uint32 scorer_id'),
      value: z.object({
        name: z.literal('scorer_id'),
        type: z.literal('uint32'),
        value: z.number(),
      }),
    }),

    z.object({
      name: z.literal('score_decimals'),
      type: z.literal('uint8'),
      signature: z.literal('uint8 score_decimals'),
      value: z.object({
        name: z.literal('score_decimals'),
        type: z.literal('uint8'),
        value: z.number(),
      }),
    }),
  ])
  .transform(([score, scoreId, score_decimals]) => {
    const profileScore = score_decimals.value.value
    return {
      profileScore,
    }
  })

const GetGitcoinPassportAttestationQuery = gql`
  query GetGitcoinPassportAttestation(
    $where: AttestationWhereInput!
    $orderBy: [AttestationOrderByWithRelationInput!]
    $take: Int
  ) {
    attestations(where: $where, orderBy: $orderBy, take: $take) {
      decodedDataJson
      attester
    }
  }
`

export const getGitcoinPassportAttestation = async (address: string) => {
  const result = await request<{
    attestations: Array<{ decodedDataJson: string; attester: string }>
  }>(easAPIURL, GetGitcoinPassportAttestationQuery, {
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
    },
    // We will just take the latest attestation to check the latest score
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
    score: gitcoinPassportAttestationDataSchema.parse(
      JSON.parse(result.attestations[0].decodedDataJson),
    ),
    attestorAddress: result.attestations[0].attester,
  }
}
