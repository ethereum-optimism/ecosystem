import { Hono } from 'hono'

import { WalletController } from './controllers/wallet.js'

export const router = new Hono()

const walletController = new WalletController()

router.get('/', (c) => {
  return c.text('OK')
})

router.get('/wallets', walletController.getAllWallets)
router.post('/wallet/:userId', walletController.createWallet)
router.get('/wallet/:userId', walletController.getWallet)
