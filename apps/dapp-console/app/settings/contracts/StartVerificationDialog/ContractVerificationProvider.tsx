import { Challenge, Contract } from '@/app/types/api'
import { ConnectedWallet } from '@privy-io/react-auth'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { Hash } from 'viem'

export type ContractVerificationSigningType = 'manual' | 'automatic'

export type ContractVerificationStep =
  | 'begin'
  | 'start-verification'
  | 'finish-verification'
  | 'verified'

export type ContractVerificationContextValue = {
  contract: Contract
  wallet?: ConnectedWallet
  step: ContractVerificationStep
  signature?: Hash
  challenge?: Challenge
  signingType: ContractVerificationSigningType
  setChallenge: (challenge: Challenge) => void
  setSigningType: (type: ContractVerificationSigningType) => void
  setStep: (step: ContractVerificationStep) => void
  setWallet: (wallet: ConnectedWallet) => void
  setSignature: (signature: Hash) => void
  onContractVerified: (contract: Contract) => void
}

export type ContractVerificationProviderProps = {
  contract: Contract
  initialStep: ContractVerificationStep
  children: ReactNode
  onContractVerified: (contract: Contract) => void
}

export const stepNextMap: Record<
  ContractVerificationStep,
  ContractVerificationStep | null
> = {
  begin: 'start-verification',
  'start-verification': 'finish-verification',
  'finish-verification': 'verified',
  verified: null,
}

export const stepBackMap: Record<
  ContractVerificationStep,
  ContractVerificationStep | null
> = {
  begin: null,
  'start-verification': 'begin',
  'finish-verification': 'start-verification',
  verified: null,
}

export const useContractVerification = () => {
  const ctx = useContext(ContractVerificationContext)

  if (!ctx) {
    throw new Error('ContractVerificationContext not set')
  }

  const { step, setStep } = ctx

  const goNext = useCallback(() => {
    const nextStep = stepNextMap[step]

    if (nextStep) {
      setStep(nextStep)
    }
  }, [step, setStep])

  const goBack = useCallback(() => {
    const prevStep = stepBackMap[step]

    if (prevStep) {
      setStep(prevStep)
    }
  }, [step, setStep])

  return {
    ...ctx,
    goNext,
    goBack,
  }
}

export const ContractVerificationContext = createContext<
  ContractVerificationContextValue | undefined
>(undefined)

export const ContractVerificationProvider = ({
  contract,
  children,
  initialStep,
  onContractVerified,
}: ContractVerificationProviderProps) => {
  const [challenge, setChallenge] = useState<Challenge | undefined>()
  const [signature, setSignature] = useState<Hash | undefined>()
  const [wallet, setWallet] = useState<ConnectedWallet | undefined>()
  const [step, setStep] = useState<ContractVerificationStep>(initialStep)
  const [signingType, setSigningType] =
    useState<ContractVerificationSigningType>('manual')

  const value = useMemo<ContractVerificationContextValue>(() => {
    return {
      contract,
      challenge,
      signingType,
      signature,
      step,
      wallet,
      setChallenge,
      setSigningType,
      setStep,
      setWallet,
      setSignature,
      onContractVerified,
    }
  }, [
    contract,
    challenge,
    step,
    wallet,
    signature,
    setChallenge,
    setSigningType,
    setStep,
    setWallet,
    setSignature,
    onContractVerified,
  ])

  return (
    <ContractVerificationContext.Provider value={value}>
      {children}
    </ContractVerificationContext.Provider>
  )
}
