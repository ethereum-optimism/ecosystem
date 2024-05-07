import { z } from 'zod'

import { addressSchema } from '@/schemas/addressSchema'

const alchemyGasManagerPolicyRulesSchema = z.object({
  maxSpendUsd: z.number().nullable(),
  maxSpendPerSenderUsd: z.number().nullable(),
  maxCount: z.number().nullable(),
  maxCountPerSender: z.number().nullable(),
  senderAllowlist: z.array(addressSchema).nullable(),
  senderBlocklist: z.array(addressSchema).nullable(),
  startTimeUnix: z.string(),
  endTimeUnix: z.string(),
  maxSpendPerUoUsd: z.number().nullable(),
  sponsorshipExpiryMs: z.string(),
})

export type AlchemyGasManagerPolicyRules = z.infer<
  typeof alchemyGasManagerPolicyRulesSchema
>

const alchemyGasManagerPolicySchema = z.object({
  policyId: z.string(),
  appId: z.string(),
  status: z.union([z.literal('active'), z.literal('inactive')]),
  rules: alchemyGasManagerPolicyRulesSchema,
  policyName: z.string(),
  lastUpdatedUnix: z.string(),
  policyType: z.literal('sponsorship'),
  policyState: z.union([z.literal('ongoing'), z.literal('expired')]),
  network: z.string(),
})

export type AlchemyGasManagerPolicy = z.infer<
  typeof alchemyGasManagerPolicySchema
>

const failureResponseSchema = z.object({
  message: z.string(),
})

const getFailureResponseMessage = async (response: Response) => {
  return await response
    .json()
    .then((data) => {
      const parsedErrorResult = failureResponseSchema.safeParse(data)
      return parsedErrorResult.success
        ? parsedErrorResult.data.message
        : 'Unknown error'
    })
    .catch((e) => 'Unknown error')
}

export const getAlchemyGasManagerHeaders = (accessKey: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${accessKey}`,
})

const createPolicySuccessResponseSchema = z.object({
  data: z.object({
    policy: alchemyGasManagerPolicySchema,
  }),
})

export const createAlchemyGasManagerPolicy = async ({
  accessKey,
  policyName,
  policyType,
  appId,
  rules,
}: {
  accessKey: string
  policyName: string
  policyType: string
  appId: string
  rules: AlchemyGasManagerPolicyRules
}) => {
  const result = await fetch(
    'https://manage.g.alchemy.com/api/gasManager/policy',
    {
      method: 'POST',
      headers: getAlchemyGasManagerHeaders(accessKey),
      body: JSON.stringify({
        policyName: policyName,
        policyType: policyType,
        appId: appId,
        rules: rules,
      }),
    },
  )

  if (!result.ok) {
    throw new Error(
      `Failed to create Alchemy Gas Manager policy: [${result.status}: ${result.statusText}] ${await getFailureResponseMessage(result)}`,
    )
  }

  const jsonResponse = await result.json()

  return createPolicySuccessResponseSchema.parse(jsonResponse).data.policy
}

const getPolicySuccessResponseSchema = z.object({
  data: z.object({
    policy: alchemyGasManagerPolicySchema,
  }),
})

export const getAlchemyGasManagerPolicy = async ({
  accessKey,
  policyId,
}: {
  accessKey: string
  policyId: string
}) => {
  const result = await fetch(
    `https://manage.g.alchemy.com/api/gasManager/policy/${policyId}`,
    {
      headers: getAlchemyGasManagerHeaders(accessKey),
    },
  )

  if (!result.ok) {
    throw new Error(
      `Failed to get Alchemy Gas Manager policy with policyId ${policyId}: [${result.status}: ${result.statusText}] ${await getFailureResponseMessage(result)}`,
    )
  }

  const jsonResponse = await result.json()

  return getPolicySuccessResponseSchema.parse(jsonResponse).data.policy
}

export const deleteAlchemyGasManagerPolicy = async ({
  accessKey,
  policyId,
}: {
  accessKey: string
  policyId: string
}) => {
  const result = await fetch(
    `https://manage.g.alchemy.com/api/gasManager/policy/${policyId}`,
    {
      method: 'DELETE',
      headers: getAlchemyGasManagerHeaders(accessKey),
    },
  )

  if (!result.ok) {
    throw new Error(
      `Failed to delete Alchemy Gas Manager policy with policyId ${policyId}: [${result.status}: ${result.statusText}] ${await getFailureResponseMessage(result)}`,
    )
  }
}
