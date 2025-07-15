import { createWallet } from '@eth-optimism/verbs'
import { Hono } from 'hono'

export const router = new Hono()

router.get('/', (c) => {
  return c.text('OK')
})

router.get('/wallet', (c) => {
  createWallet()
  return c.json({ message: 'Wallet endpoint called' })
})
