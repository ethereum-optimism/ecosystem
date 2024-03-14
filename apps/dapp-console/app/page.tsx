import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components/src/components/ui/card'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import { ProjectIconLinks } from '@/app/console/components/ProjectIconLinks'
import { BuildSection } from '@/app/console/components/BuildSection'
import { LaunchSection } from '@/app/console/components/LaunchSection'
import { PromotionsSection } from '@/app/console/components/PromotionsSection'
import { SupportSection } from '@/app/console/components/SupportSection'
import { FooterSection } from '@/app/console/components/FooterSection'
import { externalRoutes } from '@/app/constants'
import { Banner } from '@/app/components/Banner'
import Meta from '@/app/components/Meta'

export default function Page() {
  return (
    <>
      <Meta />
      <main className="flex justify-center relative">
        <Banner />
        <Card className="max-w-7xl w-full mt-36 mx-8 z-10 mb-16">
          <CardHeader className="md:p-10 lg:p-16">
            <CardTitle>
              <Text as="span" className="text-4xl mb-2">
                Superchain Dev Console
              </Text>
            </CardTitle>
            <CardDescription>
              <Text as="span" className="text-base mb-6">
                Tools to help you build, launch, and grow your dapp on the{' '}
                <a
                  href={externalRoutes.SUPERCHAIN.path}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-accent-foreground font-bold"
                >
                  {externalRoutes.SUPERCHAIN.label}
                </a>
              </Text>
            </CardDescription>
            <div className="pt-6">
              <ProjectIconLinks />
            </div>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col gap-16 md:px-10 md:pb-10 lg:px-16 lg:pb-16">
            <BuildSection />
            <LaunchSection />
            <SupportSection />
            <PromotionsSection />
            <FooterSection />
          </CardContent>
        </Card>
      </main>
    </>
  )
}
