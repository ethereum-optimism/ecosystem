import { useWallets } from '@privy-io/react-auth'

const useConnectedWallet = () => {
  const { wallets } = useWallets()
  const connectedWallet = wallets.find((w) => w.walletClientType !== 'privy') // Exclude Privy wallet

  return { connectedWallet }
}

export { useConnectedWallet }
