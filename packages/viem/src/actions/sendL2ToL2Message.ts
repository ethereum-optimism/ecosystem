import type {
  Account,
  Address,
  Chain,
  Client,
  DeriveChain,
  FormattedTransactionRequest,
  GetChainParameter,
  Hash,
  Hex,
  Transport,
  UnionOmit,
  WriteContractErrorType,
  WriteContractParameters,
} from 'viem'
import { writeContract } from 'viem/actions'

import { l2ToL2CrossDomainMessengerABI } from '@/abis.js'
import type {
  EstimateSendL2ToL2MessageGasErrorType,
  EstimateSendL2ToL2MessageGasParameters,
} from '@/actions/estimateSendL2ToL2MessageGas.js'
import { estimateSendL2ToL2MessageGas } from '@/actions/estimateSendL2ToL2MessageGas.js'
import { contracts } from '@/contracts.js'
import type {
  ErrorType,
  GetAccountParameter,
  UnionEvaluate,
} from '@/types/utils.js'

export type SendL2ToL2MessageParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  _derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = UnionEvaluate<
  UnionOmit<
    FormattedTransactionRequest<_derivedChain>,
    | 'accessList'
    | 'blobs'
    | 'data'
    | 'from'
    | 'gas'
    | 'maxFeePerBlobGas'
    | 'gasPrice'
    | 'to'
    | 'type'
    | 'value'
  >
> &
  GetAccountParameter<account, Account | Address> &
  GetChainParameter<chain, chainOverride> & {
    /** Gas limit for transaction execution on the L1. `null` to skip gas estimation & defer calculation to signer. */
    gas?: bigint | null | undefined
    /** Chain ID of the destination chain. */
    destinationChainId: number
    /** Target contract or wallet address. */
    target: Address
    /** Message payload to call target with. */
    message: Hex
  }
export type SendL2ToL2MessageReturnType = Hash
export type SendL2ToL2MessageErrorType =
  | EstimateSendL2ToL2MessageGasErrorType
  | WriteContractErrorType
  | ErrorType

/**
 * Initiates the intent of sending a L2 to L2 message. Used in the interop flow.
 *
 * - Docs: TODO add markdown docs
 * @param client - Client to use
 * @param parameters - {@link SendL2ToL2MessageParameters}
 * @returns The sendL2ToL2Message transaction hash. {@link SendL2ToL2MessageReturnType}
 * @example
 * import { createWalletClient, http } from 'viem'
 * import { optimism } from 'viem/chains'
 * import { sendL2ToL2Message } from '@eth-optimism/viem'
 *
 * const walletClientL1 = createWalletClient({
 *   chain: optimism,
 *   transport: http(),
 * })
 *
 * const request = await sendL2ToL2Message(walletClientL1, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   targetChain: optimism,
 *   destinationChainId: 8453,
 *   target: 0x...,
 *   message: 0x...,
 * })
 */
export async function sendL2ToL2Message<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: SendL2ToL2MessageParameters<chain, account, chainOverride>,
): Promise<SendL2ToL2MessageReturnType> {
  const {
    account,
    chain = client.chain,
    gas,
    destinationChainId,
    target,
    message,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
  } = parameters

  const gas_ =
    typeof gas !== 'bigint' && gas !== null
      ? await estimateSendL2ToL2MessageGas(
          client,
          parameters as EstimateSendL2ToL2MessageGasParameters,
        )
      : gas ?? undefined

  return writeContract(client, {
    account: account!,
    abi: l2ToL2CrossDomainMessengerABI,
    address: contracts.l2ToL2CrossDomainMessenger.address,
    chain,
    functionName: 'sendMessage',
    args: [destinationChainId, target, message],
    gas: gas_,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
  } satisfies WriteContractParameters as any)
}
