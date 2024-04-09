'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components'
import { AddContractCard } from '@/app/settings/contracts/AddContractCard'

export const App = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New App</CardTitle>
      </CardHeader>
      <CardContent>
        <AddContractCard appId="123" />
      </CardContent>
    </Card>
  )
}
