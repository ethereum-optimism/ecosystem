import { useCallback, useMemo, useState } from 'react'
import { useContractVerification } from '@/app/settings/contracts/StartVerificationDialog/ContractVerificationProvider'
import { apiClient } from '@/app/helpers/apiClient'
import { Hash, isHex } from 'viem'
import {
  Button,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Text,
} from '@eth-optimism/ui-components'
import { RiArrowLeftLine } from '@remixicon/react'
import { captureError } from '@/app/helpers/errorReporting'

export const FinishVerificationContent = () => {
  const {
    contract,
    challenge,
    goBack,
    goNext,
    signature,
    setSignature,
    onContractVerified,
  } = useContractVerification()

  const [signedMessage, setSignedMessage] = useState<string>(signature ?? '')
  const [isSignedMessageValid, setSignedMessageValid] = useState(!!signature)
  const { mutateAsync: completeVerification } =
    apiClient.Contracts.completeVerification.useMutation()

  const handleSignedMessageChange = useCallback(
    (e) => {
      const { value } = e.target
      const validHex = isHex(value, { strict: true })

      setSignedMessage(value)
      setSignedMessageValid(validHex)

      if (validHex) {
        setSignature(value as Hash)
      }
    },
    [setSignedMessage, setSignedMessageValid],
  ) as React.ChangeEventHandler<HTMLInputElement>

  const handleCompleteVerification = useCallback(async () => {
    try {
      await completeVerification({
        signature: signature as Hash,
        challengeId: challenge?.id as string,
      })
      onContractVerified(contract)
      goNext()
    } catch (e) {
      captureError(e, 'completeContractVerification')
    }
  }, [contract, challenge, signature, completeVerification, onContractVerified])

  const hasError = useMemo(
    () => signedMessage.length > 1 && !isSignedMessageValid,
    [signedMessage, isSignedMessageValid],
  )

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
      <Input
        placeholder="0x..."
        value={signedMessage}
        onChange={handleSignedMessageChange}
        className={hasError ? 'focus-visible:ring-destructive' : ''}
      />
      {hasError && (
        <Text
          as="span"
          className="text-xs leading-none pl-3 font-medium text-destructive"
        >
          Invalid Signature
        </Text>
      )}
      <Button onClick={handleCompleteVerification}>Continue</Button>
      <Button variant="outline">Learn More</Button>
    </>
  )
}
