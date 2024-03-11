import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components'

import { Hex, parseAbiItem } from 'viem'
import { simpleNftAddress } from '@/constants/addresses'
import { LoadingCard } from '@/components/LoadingCard'
import { SimpleNftBalance } from '@/components/SimpleNftBalance'
import { useMutation } from '@tanstack/react-query'
import { RiLoader4Line } from '@remixicon/react'
import { useWatchChainSwitch } from '@/hooks/useWatchChainSwitch'
import {
  KernelSmartAccountWithLocalAccountSigner,
  useDefaultKernelSmartAccountClient,
} from '@/libraries/permissionless/useKernelSmartAccountClient'
import { CopiableHash } from '@/components/CopiableHash'
import { useSmartAccountTransactionHashes } from '@/state/SmartAccountTransactionHashesState'
import { useSimpleNftBalance } from '@/hooks/useSimpleNftBalance'

const useSendMintNft = ({
  smartAccountClient,
  onSuccess,
}: {
  smartAccountClient?: KernelSmartAccountWithLocalAccountSigner
  onSuccess: (result: Hex) => void
}) => {
  const smartAccountAddress = smartAccountClient?.account?.address
  return useMutation({
    mutationKey: ['mintNft', smartAccountClient?.chain, smartAccountAddress],
    mutationFn: async () => {
      if (!smartAccountClient) {
        return
      }

      const transactionHash = await smartAccountClient.writeContract({
        abi: [parseAbiItem('function mint() returns (uint256)')],
        address: simpleNftAddress,
        functionName: 'mint',
      })

      onSuccess(transactionHash)

      return transactionHash
    },
  })
}

export const KernelPermissionlessCard = () => {
  const { add } = useSmartAccountTransactionHashes()

  const {
    data: kernelSmartAccountClient,
    isLoading: isKernelSmartAccountClientLoading,
  } = useDefaultKernelSmartAccountClient()

  const { refetch } = useSimpleNftBalance(
    kernelSmartAccountClient?.account.address,
  )

  const {
    mutate: mintNft,
    isPending: isTransactionPending,
    reset: resetSendMintNftUserOp,
  } = useSendMintNft({
    smartAccountClient: kernelSmartAccountClient,
    onSuccess: (hash: Hex) => {
      add({
        chainId: kernelSmartAccountClient!.chain.id,
        address: kernelSmartAccountClient!.account.address,
        transactionHash: hash,
      })
      refetch()
    },
  })

  useWatchChainSwitch(() => {
    resetSendMintNftUserOp()
  })

  if (isKernelSmartAccountClientLoading || !kernelSmartAccountClient) {
    return <LoadingCard />
  }
  const smartAccountAddress = kernelSmartAccountClient.account.address

  const isLoading = isTransactionPending
  const loadingText = 'Sending user operation...'

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
