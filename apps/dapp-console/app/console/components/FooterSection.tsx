import { forms } from '@/app/constants'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'

import Image from 'next/image'

const FooterSection = () => {
  return (
    <div className="flex flex-col items-center gap-3 py-4 text-center ">
      <Image src="/sunny.svg" alt="OP Sunny graphic" width={75} height={75} />
      <div>
        <Text as="p" className="font-semibold mb-2">
          What can we do to improve?
        </Text>
        <Text as="p" className="text-muted-foreground">
          Suggest a feature, give us feedback, or just say ‘sup nerds.
        </Text>
      </div>
      <Button variant="secondary" asChild>
        <a href={forms.CONTACT_US} target="_blank">
          <Text as="span">Contact us</Text>
        </a>
      </Button>
    </div>
  )
}

export { FooterSection }
