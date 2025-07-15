import { Hono } from 'hono'

import { WalletController } from './controllers/wallet.js'

export const router = new Hono()

const walletController = new WalletController()

router.get('/', (c) => {
  return c.text('OK')
})

router.get('/wallet', walletController.createWallet)
router.post('/wallet/:userId/lend', walletController.lendFunds)
