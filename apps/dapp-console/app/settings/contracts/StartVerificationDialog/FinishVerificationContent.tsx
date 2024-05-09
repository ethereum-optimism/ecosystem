import { useCallback } from 'react'
import { useContractVerification } from '@/app/settings/contracts/StartVerificationDialog/ContractVerificationProvider'
import { apiClient } from '@/app/helpers/apiClient'
import { Hash, isHex } from 'viem'
import {
  Button,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  toast,
} from '@eth-optimism/ui-components'
import { RiArrowLeftLine, RiLoader4Line } from '@remixicon/react'
import { captureError } from '@/app/helpers/errorReporting'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiError } from '@/app/types/api'
import { LONG_DURATION } from '@/app/constants/toast'
import { externalRoutes } from '@/app/constants'
import Link from 'next/link'
import { trackFinishContractVerification } from '@/app/event-tracking/mixpanel'

const finishVerificationSchema = z.object({
  signature: z
    .string({ required_error: '' })
    .refine((value: string) => isHex(value, { strict: true }), {
      message: 'Invalid signature.',
    }),
})

const errorMessages = {
  CHALLENGE_FAILED: 'Signature could not be verified.',
}

export const FinishVerificationContent = () => {
  const {
    contract,
    challenge,
    goBack,
    goNext,
    signature,
    signingType,
    onContractVerified,
  } = useContractVerification()
  const form = useForm<z.infer<typeof finishVerificationSchema>>({
    resolver: zodResolver(finishVerificationSchema),
    mode: 'onBlur',
    defaultValues: {
      signature,
    },
  })

  const {
    mutateAsync: completeVerification,
    isLoading: isLoadingCompleteVerification,
  } = apiClient.Contracts.completeVerification.useMutation()

  const handleCompleteVerification = useCallback(async () => {
    if (isLoadingCompleteVerification) {
      return
    }

    const { signature } = form.getValues()

    try {
      await completeVerification({
        signature: signature as Hash,
        challengeId: challenge?.id as string,
      })
      onContractVerified(contract)
      trackFinishContractVerification(
        signingType === 'manual'
          ? 'manualVerification'
          : 'automaticVerification',
      )
      goNext()
    } catch (e) {
      const apiError = e as ApiError

      if (apiError.data?.customCode === 'CHALLENGE_FAILED') {
        form.setError('signature', {
          message: errorMessages.CHALLENGE_FAILED,
        })
      } else {
        toast({
          description: 'Failed to verifiy signature',
          duration: LONG_DURATION,
        })
      }

      captureError(e, 'completeContractVerification')
    }
  }, [
    contract,
    challenge,
    signature,
    completeVerification,
    onContractVerified,
    signingType,
  ])

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-3 left-4 transition-opacity rounded-sm opacity-70 w-6 h-6"
        onClick={goBack}
      >
        <RiArrowLeftLine size={16} className="w-4 h-4" />
      </Button>
      <DialogHeader>
        <DialogTitle className="text-center">Verify</DialogTitle>
        <DialogDescription className="text-center">
          Enter the resulting signature hash from your signed message.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <FormField
          control={form.control}
          name="signature"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              {field.value?.length > 0 ? (
                <FormMessage className="ml-2 text-xs" />
              ) : null}
            </FormItem>
          )}
        />
      </Form>
      <Button
        onClick={handleCompleteVerification}
        disabled={!form.formState.isValid}
      >
        Continue{' '}
        {isLoadingCompleteVerification ? (
          <RiLoader4Line className="ml-2 animate-spin" />
        ) : null}
      </Button>
      <Button variant="outline" asChild>
        <Link href={externalRoutes.REBATE_LEARN_MORE.path} target="_blank">
          Learn More
        </Link>
      </Button>
    </>
  )
}
