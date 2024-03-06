import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components'

import {
  SendUserOperationResult,
  SmartAccountClient,
  SmartContractAccount,
} from '@alchemy/aa-core'
import { Chain, Hex, Transport, encodeFunctionData } from 'viem'
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

const useSendMintNftUserOp = (
  smartAccountClient?: SmartAccountClient<
    Transport,
    Chain,
    SmartContractAccount
  >,
) => {
  return useMutation({
    mutationKey: [
      'mintNft',
      smartAccountClient?.chain,
      smartAccountClient?.getAddress(),
    ],
    mutationFn: async () => {
      if (!smartAccountClient) {
        return
      }

      const mintCalldata = encodeFunctionData({
        abi: SimpleNftAbi,
        functionName: 'mintTo',
        args: [smartAccountClient.getAddress()],
      })

      return await smartAccountClient.sendUserOperation({
        uo: {
          target: simpleNftAddress,
          data: mintCalldata,
        },
      })
    },
  })
}

const useWaitForUserOperation = (
  smartAccountClient?: SmartAccountClient<
    Transport,
    Chain,
    SmartContractAccount
  >,
  userOp?: SendUserOperationResult,
  onSuccess?: (result: Hex) => void,
) => {
  return useQuery({
    queryKey: [
      'userOperationReceipt',
      smartAccountClient?.chain.id,
      smartAccountClient?.getAddress(),
      userOp?.hash,
    ],
    queryFn: async () => {
      const result = await smartAccountClient!.waitForUserOperationTransaction(
        userOp!,
      )
      onSuccess?.(result)
      return result
    },
    enabled: !!userOp && !!smartAccountClient,
    staleTime: Infinity,
  })
}

export const ModularAccountAaSdkCard = () => {
  const { add } = useUserOperationTransactions()

  const chainId = useChainId()

  const {
    data: modularAccountClient,
    isLoading: isModularAccountClientLoading,
  } = useDefaultModularAccountClientWithPaymaster()

  const { refetch: refetchSimpleNftBalance } = useSimpleNftBalance(
    modularAccountClient?.getAddress(),
  )

  const {
    mutate: mintNft,
    isPending: isUserOpPending,
    data: userOperationResult,
    reset: resetSendMintNftUserOp,
  } = useSendMintNftUserOp(modularAccountClient)

  const { isLoading: isUserOpLoading } = useWaitForUserOperation(
    modularAccountClient,
    userOperationResult,
    (txHash) => {
      refetchSimpleNftBalance()
      add({
        chainId,
        transactionHash: txHash,
        userOpHash: userOperationResult!.hash,
        userOp: userOperationResult!.request,
      })
    },
  )

  useWatchChainSwitch(() => {
    resetSendMintNftUserOp()
  })

  if (isModularAccountClientLoading || !modularAccountClient) {
    return <LoadingCard />
  }

  const smartAccountAddress = modularAccountClient.getAddress()

  const isLoading = isUserOpPending || isUserOpLoading

  const loadingText = isUserOpPending
    ? 'Sending user operation to bundler...'
    : 'Waiting for user operation to be included...'

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Modular account</CardTitle>
        <CardDescription>Mint an NFT using a modular account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="font-semibold">Smart account address</div>
          <div className="font-mono text-sm">{smartAccountAddress}</div>
        </div>

        <SimpleNftBalance address={smartAccountAddress} />
      </CardContent>
      <CardFooter>
        <Button
          disabled={isLoading}
          className="w-full"
          onClick={() => modularAccountClient && mintNft()}
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
