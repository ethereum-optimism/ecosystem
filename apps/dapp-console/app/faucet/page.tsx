import { FaucetPage } from '@/app/faucet/components/FaucetPage'
import { Metadata } from 'next'
import { faucetMetadata } from '@/app/seo'

export const metadata: Metadata = faucetMetadata

export default function Faucet() {
  return <FaucetPage />
}
