import { gql, request } from 'graphql-request'
import type { Address } from 'viem'
import { z } from 'zod'

import { envVars } from '@/constants'
import type { Database } from '@/db'
import { getWalletsByEntityId, updateWallet, WalletState } from '@/models'
import { metrics } from '@/monitoring/metrics'

export const getCoinbaseVerificationAttestationFromEAS = async (
  address: Address,
) => {
  const result = await request<{
    attestations: Array<{ id: string; decodedDataJson: string }>
  }>(
    envVars.CB_VERIFICATION_EAS_API_URL,
    GetCoinbaseVerificationAttestationQuery,
    {
      where: {
        recipient: {
          equals: address,
        },
        schemaId: {
          equals: envVars.CB_VERIFICATION_SCHEMA_ID,
        },
        revoked: {
          equals: false,
        },
        attester: {
          equals: envVars.CB_VERIFICATION_ATTESTER,
        },
      },
      take: 1,
    },
  )

  if (!result || !result.attestations) {
    throw Error('Graphql query error')
  }

  if (result.attestations.length === 0) {
    return null
  }

  const attestation = result.attestations[0]

  return {
    id: attestation.id,
    verifiedAccount: coinbaseVerifiedAccountAttestationDataSchema.parse(
      JSON.parse(attestation.decodedDataJson),
    ),
  }
}

export const updateCbVerificationForAllWallets = async (input: {
  db: Database
  entityId: string
}) => {
  const { db, entityId } = input
  const entityWallets = await getWalletsByEntityId(db, entityId)
  return Promise.allSettled(
    entityWallets.map(async (wallet) => {
      if (wallet.state !== WalletState.ACTIVE) {
        return Promise.resolve({})
      }

      const isWalletCbVerified = !!(
        await getCoinbaseVerificationAttestationFromEAS(wallet.address).catch(
          (err) => {
            metrics.fetchCbVerificationFromEasErrorCount.inc()
            throw err
          },
        )
      )?.verifiedAccount
      if (isWalletCbVerified !== wallet.verifications.isCbVerified) {
        return await updateWallet({
          db,
          entityId,
          walletId: wallet.id,
          update: {
            verifications: {
              ...wallet.verifications,
              isCbVerified: isWalletCbVerified,
            },
          },
        }).catch((err) => {
          metrics.updateWalletVerificationsErrorCount.inc()
          throw err
        })
      }
    }),
  )
}

const coinbaseVerifiedAccountAttestationDataSchema = z
  .tuple([
    z.object({
      name: z.literal('verifiedAccount'),
      type: z.literal('bool'),
      signature: z.literal('bool verifiedAccount'),
      value: z.object({
        name: z.literal('verifiedAccount'),
        type: z.literal('bool'),
        value: z.boolean(),
      }),
    }),
  ])
  .transform(([verifiedAccount]) => {
    return verifiedAccount.value.value
  })

const GetCoinbaseVerificationAttestationQuery = gql`
  query GetCoinbaseVerificationAttestationQuery(
    $where: AttestationWhereInput!
    $take: Int
  ) {
    attestations(where: $where, take: $take) {
      id
      decodedDataJson
    }
  }
`
