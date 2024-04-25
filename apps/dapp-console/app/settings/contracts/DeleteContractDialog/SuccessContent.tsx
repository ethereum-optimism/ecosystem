import {
  Button,
  DialogHeader,
  DialogTitle,
  Text,
} from '@eth-optimism/ui-components'
import { RiCheckboxCircleFill } from '@remixicon/react'

export type SuccessContentProps = {
  onClose: () => void
}

export const SuccessContent = ({ onClose }: SuccessContentProps) => (
  <>
    <DialogHeader className="items-center">
      <RiCheckboxCircleFill className="text-green-500" size={64} />
      <DialogTitle>
        <Text as="p">Success</Text>
      </DialogTitle>
    </DialogHeader>
    <Button className="w-full" onClick={onClose}>
      Close
    </Button>
  </>
)
