'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAddress, isHash } from 'viem'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@eth-optimism/ui-components'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { useCallback } from 'react'

export type StartVerificationHandler = (isVerified: boolean) => void

export type AddContractFormProps = {
  appId: string
  onStartVerification: StartVerificationHandler
}

const zodAddress = z
  .string({ required_error: '' })
  .refine(isAddress, { message: 'Invalid Ethereum Address' })
const zodHash = z
  .string({ required_error: '' })
  .refine(isHash, { message: 'Invalid Transaction Hash' })

const addContractSchema = z.object({
  contract: zodAddress,
  deploymentTransactionHash: zodHash,
  deployerAddress: zodAddress,
})

export const AddContractForm = ({
  appId,
  onStartVerification,
}: AddContractFormProps) => {
  const form = useForm<z.infer<typeof addContractSchema>>({
    resolver: zodResolver(addContractSchema),
    mode: 'onBlur',
  })

  const handleStartVerification = useCallback(() => {
    // TODO:
    // - add create contract call here
    // - handle api error validations
    // - make call to start verification, only if create contract call returns unverified
    onStartVerification(false)
  }, [onStartVerification])

  return (
    <div className="flex flex-col w-full">
      <Form {...form}>
        <FormField
          control={form.control}
          name="contract"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="text-muted-foreground">Contract</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              {field.value?.length > 0 ? (
                <FormMessage className="ml-2 text-xs" />
              ) : null}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deploymentTransactionHash"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="text-muted-foreground">
                Deployment Transaction Hash
              </FormLabel>
              <FormControl>
                <Input
                  id={`deployer-address-${appId}`}
                  placeholder="0x..."
                  {...field}
                />
              </FormControl>
              {field.value?.length > 0 ? (
                <FormMessage className="ml-2 text-xs" />
              ) : null}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deployerAddress"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="text-muted-foreground">
                Deployer Address
              </FormLabel>
              <FormControl>
                <Input
                  id={`deployer-address-${appId}`}
                  placeholder="0x..."
                  {...field}
                />
              </FormControl>
              {field.value?.length > 0 ? (
                <FormMessage className="ml-2 text-xs" />
              ) : null}
            </FormItem>
          )}
        />
      </Form>
      <div className="mt-3 flex flex-row justify-end w-full">
        <Button
          disabled={!form.formState.isValid}
          onClick={handleStartVerification}
        >
          <Text as="span">Verify</Text>
        </Button>
      </div>
    </div>
  )
}
