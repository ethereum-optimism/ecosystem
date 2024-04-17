import {
  Button,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Label,
  Textarea,
  useToast,
} from '@eth-optimism/ui-components'
import {
  ContractVerificationSigningType,
  useContractVerification,
} from '@/app/settings/contracts/StartVerificationDialog/ContractVerificationProvider'
import { apiClient } from '@/app/helpers/apiClient'
import { useCallback, useEffect } from 'react'
import { Hash } from 'viem'
import { LONG_DURATION } from '@/app/constants/toast'
import { RiFileCopyFill } from '@remixicon/react'
import { captureError } from '@/app/helpers/errorReporting'

const descriptionBySigningType: Record<
  ContractVerificationSigningType,
  string
> = {
  manual: `Using your preferred provider, copy and sign the message below. Then, continue to the next step.`,
  automatic: `You'll be prompted to sign the message with your connected wallet once you continue to the next step.`,
}

export const StartVerificationContent = () => {
  const {
    challenge,
    contract,
    signingType,
    setChallenge,
    goNext,
    wallet,
    setSignature,
  } = useContractVerification()
  const { toast } = useToast()

  const { mutateAsync: startVerification } =
    apiClient.Contracts.startVerification.useMutation()

  useEffect(() => {
    // challenge is already set no need to fetch again
    if (challenge) {
      return
    }

    ;(async () => {
      try {
        const challengeToSign = await startVerification({
          contractId: contract.id,
        })
        setChallenge(challengeToSign)
      } catch (e) {
        captureError(e, 'startContractVerification')
      }
    })()
  }, [
    challenge,
    setChallenge,
    startVerification,
    setSignature,
    signingType,
    goNext,
  ])

  const handleContinue = useCallback(async () => {
    if (signingType === 'automatic') {
      try {
        const signature = await wallet?.sign(challenge?.challenge as string)
        setSignature(signature as Hash)
      } catch (e) {
        captureError(e, 'signMessage')
        return
      }
    }
    goNext()
  }, [challenge, signingType, wallet])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(challenge?.challenge as string)

    toast({
      description: 'Message Copied',
      duration: LONG_DURATION,
    })
  }, [challenge, toast])

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center">Verify</DialogTitle>
        <DialogDescription className="text-center">
          {descriptionBySigningType[signingType]}
        </DialogDescription>
      </DialogHeader>
      <Label>Message to sign</Label>
      <div className="flex flex-col w-full relative">
        <Textarea
          value={challenge?.challenge ?? ''}
          className="pr-16 resize-none cursor-default focus-visible:ring-0"
          readOnly
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4"
          onClick={handleCopy}
        >
          <RiFileCopyFill size={20} />
        </Button>
      </div>
      <Button onClick={handleContinue} disabled={!challenge}>
        Continue
      </Button>
      <Button variant="outline">Learn More</Button>
    </>
  )
}
