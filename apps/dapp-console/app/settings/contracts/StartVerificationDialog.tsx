import { LONG_DURATION } from '@/app/constants/toast'
import { shortenAddress } from '@eth-optimism/op-app'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
  useToast,
} from '@eth-optimism/ui-components'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import {
  RiArrowLeftLine,
  RiCheckboxCircleFill,
  RiFileCopyFill,
} from '@remixicon/react'
import { useCallback, useMemo, useState } from 'react'
import { Address, isHash } from 'viem'

export type StartVerificationDialogStep =
  | 'begin'
  | 'start-verification'
  | 'finish-verification'
  | 'verified'

export type StartVerificationContentProps = {
  contractAddress?: Address
  payloadToSign?: string
  goBack?: () => void
  goNext?: () => void
}

export type StartVerificationDialogProps = {
  initialStep: StartVerificationDialogStep
  contractAddress: Address
  open: boolean
  onOpenChange: (isOpen: boolean) => void
}

const BeginContent = ({
  contractAddress,
  goNext,
}: StartVerificationContentProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center">
          Verify Contract Ownership
        </DialogTitle>
        {contractAddress && (
          <DialogDescription className="text-center">
            {shortenAddress(contractAddress)}
          </DialogDescription>
        )}
      </DialogHeader>
      <Button onClick={goNext}>Verify Manually</Button>
      <Button variant="outline" onClick={goNext}>
        Connect Wallet
      </Button>
    </>
  )
}

const StartVerificationContent = ({
  goNext,
}: StartVerificationContentProps) => {
  const { toast } = useToast()
  const mockedPayload =
    'I verify that I’m the owner of 0xA2C6277931328e2028C3DB10625D767de19151e92, and I’m an optimist.'

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(mockedPayload)

    toast({
      description: 'Message Copied',
      duration: LONG_DURATION,
    })
  }, [mockedPayload, toast])

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center">Verify Manually</DialogTitle>
        <DialogDescription className="text-center">
          Using your preferred provider, copy and sign the message below. Then,
          continue to the next step.
        </DialogDescription>
      </DialogHeader>
      <Label>Message to sign</Label>
      <div className="flex flex-col w-full relative">
        <Textarea
          className="pr-16 resize-none cursor-default focus-visible:ring-0"
          readOnly
        >
          {mockedPayload}
        </Textarea>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4"
          onClick={handleCopy}
        >
          <RiFileCopyFill size={20} />
        </Button>
      </div>
      <Button onClick={goNext}>Continue</Button>
      <Button variant="outline">Learn More</Button>
    </>
  )
}

const FinishVerificationContent = ({
  goBack,
  goNext,
}: StartVerificationContentProps) => {
  const [signedMessage, setSignedMessage] = useState('')
  const [isSignedMessageValid, setSignedMessageValid] = useState(false)

  const handleSignedMessageChange = useCallback(
    (e) => {
      const { value } = e.target
      setSignedMessage(value)
      setSignedMessageValid(isHash(value))
    },
    [setSignedMessage, setSignedMessageValid],
  ) as React.ChangeEventHandler<HTMLInputElement>

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
        <DialogTitle className="text-center">Verify Manually</DialogTitle>
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
      <Button onClick={goNext} disabled={!isSignedMessageValid}>
        Continue
      </Button>
      <Button variant="outline">Learn More</Button>
    </>
  )
}

const VerifiedContent = ({
  contractAddress,
}: StartVerificationContentProps) => (
  <>
    <DialogHeader className="items-center">
      <RiCheckboxCircleFill className="text-green-500" size={64} />
      <DialogTitle>
        <Text as="p">Success</Text>
      </DialogTitle>
      {contractAddress && (
        <DialogDescription>
          <Text as="p">
            You verified ownership of {shortenAddress(contractAddress)}
          </Text>
        </DialogDescription>
      )}
    </DialogHeader>
    <DialogClose asChild>
      <Button>Close</Button>
    </DialogClose>
  </>
)

export const StartVerificationDialog = ({
  contractAddress,
  initialStep,
  open,
  onOpenChange,
}: StartVerificationDialogProps) => {
  const [step, setStep] = useState(initialStep)

  const handleStartVerification = useCallback(() => {
    setStep('start-verification')
  }, [setStep])

  const handleSignMessage = useCallback(() => {
    setStep('finish-verification')
  }, [setStep])

  const handleVerified = useCallback(() => {
    setStep('verified')
  }, [setStep])

  const content = useMemo(() => {
    if (step === 'begin') {
      return (
        <BeginContent
          contractAddress={contractAddress}
          goNext={handleStartVerification}
        />
      )
    } else if (step === 'start-verification') {
      return <StartVerificationContent goNext={handleSignMessage} />
    } else if (step === 'finish-verification') {
      return (
        <FinishVerificationContent
          goNext={handleVerified}
          goBack={handleStartVerification}
        />
      )
    } else {
      return <VerifiedContent contractAddress={contractAddress} />
    }
  }, [step])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  )
}
