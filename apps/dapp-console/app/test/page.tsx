'use client'

import {
  AvatarImage,
  Avatar,
} from '@eth-optimism/ui-components/src/components/ui/avatar/avatar'
import Link from 'next/link'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Label } from '@eth-optimism/ui-components/src/components/ui/label/label'
import { Input } from '@eth-optimism/ui-components/src/components/ui/input/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
  CardContent,
} from '@eth-optimism/ui-components/src/components/ui/card/card'
import Image from 'next/image'

export default function TestPage() {
  return (
    <div className="flex w-full align-middle">
      <TestComponent />
    </div>
  )
}

const TestComponent = () => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex-row pb-4">
          <div>
            <CardTitle className="text-base">Get maximum test tokens</CardTitle>
            <CardDescription>
              Verify your onchain identity with Optimist NFT, Gitcoin, Coinbase
              Verification, World ID, or attestations.
              <Link className="text-blue-500" href="#">
                See details
              </Link>
            </CardDescription>
          </div>
          <Image src="/images/eth-logo.png" width={20} height={20} alt="test" />
        </div>
        <Button className="w-fit mb-4">Connect wallet</Button>
        <p className="text-sm text-muted-foreground">
          No onchain identity? You can claim the minimum amount of 0.05 test ETH
          on 1 network every 24 hours.
        </p>
      </div>
      <div className="w-full border-b-1 border-accent" />
      <CardContent className="pt-10">
        <div className="mb-4">
          <Label htmlFor="address">Address</Label>
          <Input id="address" placeholder="Enter ETH address" />
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled variant="secondary">
          Button
        </Button>
      </CardFooter>
    </Card>
  )
}
