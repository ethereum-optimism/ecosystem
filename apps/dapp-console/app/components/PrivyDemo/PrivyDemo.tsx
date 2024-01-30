'use client'

import { Button } from '@eth-optimism/ui-components/src/components/ui/button'
import { useWallets } from '@privy-io/react-auth'
import { usePrivy } from '@privy-io/react-auth'

const PrivyDemo = () => {
  const {
    login,
    logout,
    user,
    linkWallet,
    connectWallet,
    authenticated,
    unlinkWallet,
  } = usePrivy()
  const { wallets } = useWallets()

  return (
    <div className="flex flex-col gap-2 justify-center">
      <h1 className="text-2xl font-bold">Privy Demo</h1>
      <p>
        <span className="font-bold">User ID: </span>
        {user?.id}
      </p>
      <p>
        <span className="font-bold">Email: </span>
        {`${user?.email?.address}`}
      </p>

      <p>
        <span className="font-bold">Connected Wallet: </span>
        {wallets.length === 0 ? 'No Wallets Connected' : ''}
        {wallets.map((wallet) => (
          <div key={wallet.address}>
            <p>{wallet.address}</p>
          </div>
        ))}
      </p>

      <p>
        <span className="font-bold">Linked Wallet(s): </span>
      </p>
      {user?.linkedAccounts.map(
        (account) =>
          account.type === 'wallet' && (
            <div
              key={`${account.verifiedAt}`}
              className="flex items-center gap-4"
            >
              <p>{`${account.address}`}</p>
              <Button
                variant="secondary"
                onClick={() => unlinkWallet(account.address)}
              >
                Unlink Wallet
              </Button>
            </div>
          ),
      )}

      {authenticated && (
        <Button className="w-48" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}

      {authenticated && (
        <Button className="w-48" onClick={linkWallet}>
          Link wallet
        </Button>
      )}

      {!authenticated ? (
        <Button className="w-48" onClick={login}>
          Sign up with Privy
        </Button>
      ) : (
        <Button className="w-48" onClick={logout}>
          Logout
        </Button>
      )}
    </div>
  )
}

export { PrivyDemo }
