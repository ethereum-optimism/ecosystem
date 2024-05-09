'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getAddress, isAddress, isHash } from 'viem'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  toast,
} from '@eth-optimism/ui-components'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { useCallback, useState } from 'react'
import { apiClient } from '@/app/helpers/apiClient'
import { optimism } from 'viem/chains'
import { ApiError, Contract } from '@/app/types/api'
import { captureError } from '@/app/helpers/errorReporting'
import {
  L2NetworkSelect,
  L2NetworkSelectItem,
} from '@/app/components/Selects/L2NetworkSelect'
import { RiLoader4Line } from '@remixicon/react'
import { LONG_DURATION } from '@/app/constants/toast'
import {
  trackAddActionClick,
  trackAddActionConfirm,
} from '@/app/event-tracking/mixpanel'

export type StartVerificationHandler = (
  contract: Contract,
  isVerified: boolean,
) => void

export type AddContractFormProps = {
  appId: string
  unverifiedContract?: Contract
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

const errorMessages = {
  DEPLOYMENT_CONTRACT_ALREADY_EXISTS: 'Contract already exists.',
  DEPLOYMENT_CONTRACT_ADDRESS_INCORRECT:
    'Address does not match expected contract address for transaction.',
  DEPLOYMENT_TX_NOT_FOUND: 'Not able to find transaction hash.',
  DEPLOYER_ADDRESS_INCORRECT:
    'Address does not match expected deployer address for transaction.',
}

export const AddContractForm = ({
  appId,
  unverifiedContract,
  onStartVerification,
}: AddContractFormProps) => {
  const [selectedChainId, setSelectedChainId] = useState<number>(optimism.id)

  const { mutateAsync: createContract, isLoading: isLoadingCreateContract } =
    apiClient.Contracts.createContract.useMutation()

  const form = useForm<z.infer<typeof addContractSchema>>({
    resolver: zodResolver(addContractSchema),
    mode: 'onBlur',
    defaultValues: unverifiedContract
      ? {
          contract: unverifiedContract.contractAddress,
          deploymentTransactionHash: unverifiedContract.deploymentTxHash,
          deployerAddress: unverifiedContract.deployerAddress,
        }
      : undefined,
  })

  const handleNetworkChange = useCallback(
    (item: L2NetworkSelectItem) => {
      setSelectedChainId(item.id)

      const maybeTxNotFoundError =
        form.formState.errors.deploymentTransactionHash
      if (
        maybeTxNotFoundError?.message === errorMessages.DEPLOYMENT_TX_NOT_FOUND
      ) {
        form.clearErrors('deploymentTransactionHash')
        form.trigger('deploymentTransactionHash')
      }
    },
    [setSelectedChainId, form],
  )

  const handleCreateContract = useCallback(async () => {
    try {
      trackAddActionClick('contract')
      const formValues = form.getValues()

      let contractToVerifiy = unverifiedContract

      if (!contractToVerifiy) {
        const { result } = await createContract({
          appId,
          chainId: selectedChainId,
          contractAddress: getAddress(formValues.contract),
          deployerAddress: getAddress(formValues.deployerAddress),
          deploymentTxHash: formValues.deploymentTransactionHash,
        })
        contractToVerifiy = result as Contract
        trackAddActionConfirm('contract')
      }

      onStartVerification(contractToVerifiy, false)
    } catch (e) {
      const apiError = e as ApiError

      if (apiError.data?.customCode === 'DEPLOYMENT_TX_NOT_FOUND') {
        form.setError('deploymentTransactionHash', {
          message: errorMessages.DEPLOYMENT_TX_NOT_FOUND,
        })
      } else if (
        apiError.data?.customCode === 'DEPLOYMENT_CONTRACT_ADDRESS_INCORRECT'
      ) {
        form.setError('contract', {
          message: errorMessages.DEPLOYMENT_CONTRACT_ADDRESS_INCORRECT,
        })
      } else if (
        apiError.data?.customCode === 'DEPLOYMENT_CONTRACT_ALREADY_EXISTS'
      ) {
        form.setError('contract', {
          message: errorMessages.DEPLOYMENT_CONTRACT_ALREADY_EXISTS,
        })
      } else if (apiError.data?.customCode === 'DEPLOYER_ADDRESS_INCORRECT') {
        form.setError('deployerAddress', {
          message: errorMessages.DEPLOYER_ADDRESS_INCORRECT,
        })
      } else {
        toast({
          description: 'Failed to create contract',
          duration: LONG_DURATION,
        })
      }

      captureError(e, 'createContract')
    }
  }, [
    appId,
    createContract,
    form,
    unverifiedContract,
    selectedChainId,
    onStartVerification,
  ])

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
      <div className="mt-3 flex flex-col gap-y-2 sm:flex-row justify-between w-full">
        <L2NetworkSelect
          includeTestnets
          onNetworkChange={handleNetworkChange}
        />
        <Button
          disabled={!form.formState.isValid}
          onClick={handleCreateContract}
        >
          <Text as="span">Verify</Text>{' '}
          {isLoadingCreateContract ? (
            <RiLoader4Line className="ml-1 animate-spin" />
          ) : null}
        </Button>
      </div>
    </div>
  )
}
