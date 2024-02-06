import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components/src/components/ui/card'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import { ProjectIconLinks } from '@/app/console/components/ProjectIconLinks'

export default function Page() {
  return (
    <main className="flex justify-center relative">
      <Banner />
      <Card className="max-w-7xl w-full mt-36 mx-8 z-10">
        <CardHeader>
          <CardTitle>
            <Text as="span" className="text-4xl mb-2">
              Dapp Developer Console
            </Text>
          </CardTitle>
          <CardDescription>
            <Text as="span" className="text-base mb-6">
              Tools to help you build, launch, and grow your dapp on the{' '}
              <b className="text-accent-foreground">Superchain</b>
            </Text>
          </CardDescription>
          <div className="pt-6">
            <ProjectIconLinks />
          </div>
        </CardHeader>
        <CardContent>hey</CardContent>
      </Card>
    </main>
  )
}

const Banner = () => {
  return <div className="absolute -inset-x-0 w-full h-80 bg-red-200" />
}
