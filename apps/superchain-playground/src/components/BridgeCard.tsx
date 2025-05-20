import type { Network } from '@eth-optimism/viem/chains'
import { produce } from 'immer'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import type { Address, Chain, ChainContract, Hex } from 'viem'
import { encodeFunctionData, formatEther, parseEther, toHex } from 'viem'
import {
  useAccount,
  useBalance,
  useSimulateContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { l1StandardBridgeAbi } from '@/constants/l1StandardBridgeAbi'
import { Multicall3Abi } from '@/constants/Multicall3Abi'
import { truncateHash } from '@/lib/truncateHash'
import { cn } from '@/lib/utils'

const truncateDecimal = (
  decimalString: string,
  maxLengthAfterDecimal = 5,
): string => {
  // Check if there's a decimal point
  if (decimalString.includes('.')) {
    const parts = decimalString.split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1]!

    return `${integerPart}.${decimalPart.substring(0, maxLengthAfterDecimal)}`
  }
  return decimalString // Return as it is if no decimal point
}

const useFormattedBalance = (chainId: number) => {
  const { address } = useAccount()
  const { data } = useBalance({
    address: address!,
    chainId: chainId,
    query: {
      enabled: !!address,
    },
  })

  if (!address || !data) {
    return undefined
  }

  return `${truncateDecimal(data.formatted)} ${data.symbol}`
}

const NetworkSwitch = ({
  chain,
  onChange,
  isSelected,
}: {
  chain: Chain
  onChange: (isSelected: boolean) => void
  isSelected: boolean
}) => {
  const { name, id } = chain
  const formattedBalance = useFormattedBalance(id)
  return (
    <div
      className="w-full flex cursor-pointer hover:bg-muted/50 rounded-lg py-2 px-2 items-center"
      onClick={(e) => {
        e.stopPropagation()
        onChange(!isSelected)
      }}
    >
      <Switch
        id={`${id}-network-switch`}
        onCheckedChange={(checked) => {
          onChange(checked)
        }}
        checked={isSelected}
        className="self-center data-[state=checked]:bg-primary"
      />
      <div className="pl-2 w-full cursor-pointer flex items-center justify-between select-none pr-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        <div className="flex items-center gap-2">{name}</div>
        {formattedBalance && (
          <div className="text-muted-foreground text-sm">
            {formattedBalance}
          </div>
        )}
      </div>
    </div>
  )
}

const useNetworkSelection = (chains: Chain[]) => {
  const [isSelectedByChainId, setIsSelectedByChainId] = useState<
    Record<number, boolean>
  >(
    chains.reduce<Record<number, boolean>>((acc, chain) => {
      acc[chain.id] = false
      return acc
    }, {}),
  )

  return {
    allChains: chains,
    selectedChains: chains.filter((l2Chain) => {
      return !!isSelectedByChainId[l2Chain.id]
    }),
    setIsSelected: (chainId: number, isSelected: boolean) => {
      setIsSelectedByChainId((prevVal) =>
        produce(prevVal, (draft) => {
          draft[chainId] = isSelected
        }),
      )
    },
    isSelectedByChainId,
  }
}

const NetworkSwitches = ({
  chains,
  isSelectedByChainId,
  setIsSelected,
}: {
  chains: Chain[]
  isSelectedByChainId: Record<number, boolean>
  setIsSelected: (chainId: number, isSelected: boolean) => void
}) => {
  const allSelected = chains.every((chain) => isSelectedByChainId[chain.id])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Label>Networks</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={(checked) => {
                chains.forEach((chain) => {
                  setIsSelected(chain.id, checked === true)
                })
              }}
            />
            <Label
              htmlFor="select-all"
              className="text-sm font-normal text-muted-foreground"
            >
              Select all
            </Label>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Current balance</div>
      </div>
      <div id="network-switch-input" className="flex flex-col">
        {chains.map((chain) => {
          return (
            <NetworkSwitch
              key={chain.id}
              chain={chain}
              isSelected={isSelectedByChainId[chain.id] ?? false}
              onChange={(isChecked) => {
                setIsSelected(chain.id, isChecked)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

const AmountQuickInputButton = ({
  amount,
  isSelected,
  onClick,
}: {
  isSelected: boolean
  onClick: () => void
  amount: bigint
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        'flex-1 transition-all',
        isSelected
          ? 'border-primary/90 bg-primary text-primary-foreground hover:bg-primary/90'
          : 'hover:border-primary/50',
      )}
    >
      {formatEther(amount)} ETH
    </Button>
  )
}

const QUICK_INPUT_AMOUNTS = [
  parseEther('10'),
  parseEther('1'),
  parseEther('0.1'),
  parseEther('0.01'),
]

const AmountInput = ({
  amount,
  setAmount,
}: {
  amount: bigint
  setAmount: (amount: bigint) => void
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="bridge-amount-input">Amount</Label>
      <Input
        id="bridge-amount-input"
        type="number"
        placeholder="0.0"
        value={formatEther(amount)}
        onChange={(e) => setAmount(parseEther(e.target.value))}
      />
      <div className="flex gap-2">
        {QUICK_INPUT_AMOUNTS.map((quickInputAmount) => {
          return (
            <AmountQuickInputButton
              key={`quick-input-${quickInputAmount}`}
              amount={quickInputAmount}
              isSelected={quickInputAmount === amount}
              onClick={() => setAmount(quickInputAmount)}
            />
          )
        })}
      </div>
    </div>
  )
}

const Preview = ({
  selectedChains,
  amount,
}: {
  selectedChains: Chain[]
  amount: bigint
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Total amount</div>
        <div className="font-medium text-lg">
          {formatEther(BigInt(selectedChains.length) * amount)} ETH
        </div>
      </div>
      {selectedChains.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">Bridging to:</div>
          <div className="flex flex-wrap gap-2">
            {selectedChains.map((chain) => (
              <div
                key={chain.id}
                className="bg-background px-3 py-1 rounded-full text-sm border"
              >
                {chain.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const getBridgeFundsFunctionData = (address?: Address) => {
  if (!address) {
    return null
  }
  return encodeFunctionData({
    abi: l1StandardBridgeAbi,
    functionName: 'bridgeETHTo',
    args: [address, 1000000, toHex('')],
  })
}

const getBlockExplorerLink = (chain: Chain, transactionHash: Hex) => {
  const baseUrl = chain.blockExplorers!.default.url
  return `${baseUrl}/tx/${transactionHash}`
}

const SwitchToChainButton = ({ chain }: { chain: Chain }) => {
  const { switchChain, isPending } = useSwitchChain()
  return (
    <Button
      className="w-full"
      disabled={!switchChain || isPending}
      onClick={() => {
        switchChain?.({ chainId: chain.id })
      }}
    >
      Switch network to {chain.name}
    </Button>
  )
}

export const BridgeCard = ({ network }: { network: Network }) => {
  const chainId = network.sourceChain.id
  const chains = network.chains

  const formattedL1Balance = useFormattedBalance(chainId)
  const { chain } = useAccount()

  const { toast } = useToast()

  const { selectedChains, allChains, setIsSelected, isSelectedByChainId } =
    useNetworkSelection(chains)

  const [amount, setAmount] = useState<bigint>(0n)

  const { address } = useAccount()

  const { data: simulatedData, error } = useSimulateContract({
    abi: Multicall3Abi,
    functionName: 'aggregate3Value',
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    args: [
      [
        ...selectedChains.map((selectedChain) => {
          const l1StandardBridge = selectedChain.contracts
            ?.l1StandardBridge as { [key: number]: ChainContract }

          return {
            target: l1StandardBridge[chainId]!.address,
            allowFailure: false,
            callData: getBridgeFundsFunctionData(address!)!,
            value: amount,
          }
        }),
      ],
    ],
    value: amount * BigInt(selectedChains.length),
    // enabled: !!address && amount > 0n && opStackChains.length > 0,
  })

  if (error) {
    console.error(error)
  }

  const {
    writeContract,
    isPending,
    data: response,
  } = useWriteContract({
    mutation: {
      onSuccess: (hash: Hex) => {
        toast({
          title: 'L1 transaction sent',
          description: `${truncateHash(hash)}`,
          action: (
            <ToastAction
              altText="View on explorer"
              onClick={() => {
                window.open(
                  getBlockExplorerLink(network.sourceChain, hash),
                  '_blank',
                )
              }}
            >
              View on explorer
            </ToastAction>
          ),
        })
      },
    },
  })

  const { isLoading: isConfirmationLoading } = useWaitForTransactionReceipt({
    hash: response,
    confirmations: 5,
  })

  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex items-center justify-between h-8">
          <CardTitle>{network.sourceChain.name}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal text-muted-foreground">
              Balance:
            </span>
            <span className="text-md font-medium">
              {formattedL1Balance || '   '}
            </span>
          </div>
        </div>
        <CardDescription className="mt-2">
          Bridge your ETH to OP Stack chains
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <NetworkSwitches
          chains={allChains}
          isSelectedByChainId={isSelectedByChainId}
          setIsSelected={setIsSelected}
        />
        <AmountInput amount={amount} setAmount={setAmount} />
        <Separator className="" />
        <Preview selectedChains={selectedChains} amount={amount} />
      </CardContent>
      <CardFooter className="flex gap-2">
        {chain?.id === network.sourceChain.id ? (
          <Button
            className="w-full gap-2"
            disabled={
              isPending ||
              !writeContract ||
              isConfirmationLoading ||
              !simulatedData?.request
            }
            onClick={() => {
              writeContract(simulatedData!.request)
            }}
          >
            Bridge <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <SwitchToChainButton chain={network.sourceChain} />
        )}
      </CardFooter>
    </Card>
  )
}
