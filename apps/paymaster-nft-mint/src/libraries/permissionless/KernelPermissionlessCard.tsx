import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components'

import { Chain, Hex, LocalAccount, Transport, encodeFunctionData } from 'viem'
import { SimpleNftAbi } from '@/abis/SimpleNftAbi'
import { useDefaultModularAccountClientWithPaymaster } from '@/libraries/aa-sdk/useModularAccountClientWithPaymaster'
import { simpleNftAddress } from '@/constants/addresses'
import { LoadingCard } from '@/components/LoadingCard'
import { SimpleNftBalance } from '@/components/SimpleNftBalance'
import { useMutation, useQuery } from '@tanstack/react-query'
import { RiLoader4Line } from '@remixicon/react'
import { useSimpleNftBalance } from '@/hooks/useSimpleNftBalance'
import { useWatchChainSwitch } from '@/hooks/useWatchChainSwitch'
import { useUserOperationTransactions } from '@/state/UserOperationTransactionsState'
import { useChainId } from 'wagmi'
import {
  KernelSmartAccountWithLocalAccountSigner,
  useDefaultKernelSmartAccountClient,
} from '@/libraries/permissionless/useKernelSmartAccountClient'
import { CopiableHash } from '@/components/CopiableHash'
import {
  ENTRYPOINT_ADDRESS_V06,
  SmartAccountClient as PermissionlessSmartAccountClient,
} from 'permissionless'

const useSendMintNftUserOp = (
  smartAccountClient?: KernelSmartAccountWithLocalAccountSigner,
) => {
  const smartAccountAddress = smartAccountClient?.account?.address
  return useMutation({
    mutationKey: ['mintNft', smartAccountClient?.chain, smartAccountAddress],
    mutationFn: async () => {
      if (!smartAccountClient) {
        return
      }

      const mintCalldata = encodeFunctionData({
        abi: SimpleNftAbi,
        functionName: 'mintTo',
        args: [smartAccountAddress!],
      })

      return await smartAccountClient.sendTransaction({
        to: simpleNftAddress,
        data: mintCalldata,
      })
    },
  })
}

export const KernelPermissionlessCard = () => {
  const {
    data: kernelSmartAccountClient,
    isLoading: isKernelSmartAccountClientLoading,
  } = useDefaultKernelSmartAccountClient()

  const {
    mutate: mintNft,
    isPending: isUserOpPending,
    data: userOperationResult,
    reset: resetSendMintNftUserOp,
  } = useSendMintNftUserOp(kernelSmartAccountClient)

  if (isKernelSmartAccountClientLoading || !kernelSmartAccountClient) {
    return <LoadingCard />
  }
  const smartAccountAddress = kernelSmartAccountClient.account.address

  const isLoading = isUserOpPending
  const loadingText = isUserOpPending
    ? 'Sending user operation to bundler...'
    : 'Waiting for user operation to be included...'

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Kernel account</CardTitle>
        <CardDescription>Mint an NFT using a Kernel account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="font-semibold">Smart account address</div>
          <div className="font-mono text-sm">
            <CopiableHash
              href={`https://onceupon.gg/${smartAccountAddress}`}
              hash={smartAccountAddress}
            />
          </div>
        </div>

        <SimpleNftBalance address={smartAccountAddress} />
      </CardContent>
      <CardFooter>
        <Button
          disabled={isLoading}
          className="w-full"
          onClick={() => mintNft()}
        >
          {isLoading ? (
            <>
              {loadingText}
              <RiLoader4Line className="ml-1 w-[1rem] h-[1rem] animate-spin" />
            </>
          ) : (
            'Mint NFT'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
