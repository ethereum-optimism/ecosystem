import {
  Button,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Text,
} from '@eth-optimism/ui-components'
import { useContractVerification } from '@/app/settings/contracts/StartVerificationDialog/ContractVerificationProvider'
import { RiCheckboxCircleFill } from '@remixicon/react'
import { shortenAddress } from '@eth-optimism/op-app'

export const VerifiedContent = () => {
  const { contract } = useContractVerification()

  return (
    <>
      <DialogHeader className="items-center">
        <RiCheckboxCircleFill className="text-green-500" size={64} />
        <DialogTitle>
          <Text as="p">Success</Text>
        </DialogTitle>
        {contract.contractAddress && (
          <DialogDescription>
            <Text as="p">
              You verified ownership of{' '}
              {shortenAddress(contract.contractAddress)}
            </Text>
          </DialogDescription>
        )}
      </DialogHeader>
      <DialogClose asChild>
        <Button>Close</Button>
      </DialogClose>
    </>
  )
}
