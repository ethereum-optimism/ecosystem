import { Button } from '@eth-optimism/ui-components/src/components/ui/button'
import { Card } from '@eth-optimism/ui-components/src/components/ui/card'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import { RiCompasses2Line } from '@remixicon/react'
import { forms } from '@/app/constants'
import { Banner } from '@/app/components/Banner'

export default function Insights() {
  return (
    <main className="flex justify-center relative">
      <Banner />
      <Card className="max-w-7xl w-full mt-36 mx-8 mb-16 z-10 p-16 flex flex-col items-center">
        <RiCompasses2Line size={64} className="mb-4" />
        <Text as="h2" className="text-base mb-1 font-semibold">
          We're still working on insights
        </Text>
        <Text as="p" className="text-muted-foreground text-center mb-4">
          What kind of content would be valuable to you?
        </Text>
        <Button variant="secondary" asChild>
          <a href={forms.CONTACT_US} target="_blank" rel="noopener noreferrer">
            <Text as="span">Contact us</Text>
          </a>
        </Button>
      </Card>
    </main>
  )
}
