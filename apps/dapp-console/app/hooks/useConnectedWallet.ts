import { useWallets } from '@privy-io/react-auth'

const useConnectedWallet = () => {
  const { wallets } = useWallets()
  const connectedWallet = wallets.find((w) => w.walletClientType !== 'privy') // Exclude Privy wallet

  return { connectedWallet }
}

const useConnectedChainId = () => {
  const { connectedWallet } = useConnectedWallet()

  if (!connectedWallet) {
    return { chainId: connectedWallet }
  }

  const chainId = connectedWallet.chainId.split(':')[1]
  return { chainId: Number(chainId) }
}

export { useConnectedWallet, useConnectedChainId }
