import { Contract } from '@/app/types/api'
import { shortenAddress } from '@/app/utils/address'
import { Button, DialogHeader, Text } from '@eth-optimism/ui-components'
import { RiLoader4Line } from '@remixicon/react'

export type DeleteContractContentProps = {
  contract: Contract
  isLoading: boolean
  onDeleteContract: () => void
  onCancel: () => void
}

export const DialogContractContent = ({
  contract,
  isLoading,
  onDeleteContract,
  onCancel,
}: DeleteContractContentProps) => (
  <>
    <DialogHeader>
      <Text as="p" className="text-lg font-semibold">
        Delete Contract
      </Text>
    </DialogHeader>

    <Text as="p">
      Are you sure you want to delete{' '}
      <Text as="span" className="text-default font-semibold">
        {shortenAddress(contract.contractAddress)}
      </Text>
      ?
    </Text>

    <Button className="w-full" onClick={onDeleteContract}>
      <Text as="span" className="cursor-pointer">
        Confirm
      </Text>
      {isLoading ? <RiLoader4Line className="ml-2 animate-spin" /> : null}
    </Button>

    <Button className="w-full" variant="outline" onClick={onCancel}>
      <Text as="span" className="cursor-pointer">
        Cancel
      </Text>
    </Button>
  </>
)
