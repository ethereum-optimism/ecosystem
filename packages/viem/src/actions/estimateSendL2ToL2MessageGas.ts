import type {
  Account,
  Address,
  Chain,
  Client,
  DeriveChain,
  EstimateContractGasErrorType,
  EstimateContractGasParameters,
  FormattedTransactionRequest,
  GetChainParameter,
  Hex,
  Transport,
  UnionOmit,
} from 'viem'
import { estimateContractGas } from 'viem/actions'

import { l2ToL2CrossDomainMessengerABI } from '@/abis.js'
import { contracts } from '@/contracts.js'
import type {
  ErrorType,
  GetAccountParameter,
  UnionEvaluate,
} from '@/types/utils.js'

export type EstimateSendL2ToL2MessageGasParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  _derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = UnionEvaluate<
  UnionOmit<
    FormattedTransactionRequest<_derivedChain>,
    | 'accessList'
    | 'data'
    | 'from'
    | 'gas'
    | 'gasPrice'
    | 'to'
    | 'type'
    | 'value'
  >
> &
  GetAccountParameter<account, Account | Address> &
  GetChainParameter<chain, chainOverride> & {
    /** Gas limit for transaction execution on the L2. */
    gas?: bigint | undefined
    /** Chain ID of the destination chain. */
    destinationChainId: number
    /** Target contract or wallet address. */
    target: Address
    /** Message payload to call target with. */
    message: Hex
  }
export type EstimateSendL2ToL2MessageGasReturnType = bigint
export type EstimateSendL2ToL2MessageGasErrorType =
  | EstimateContractGasErrorType
  | ErrorType

/**
 * Estimates gas required to send an intent of sending a L2 to L2 message. Used in the interop flow.
 *
 * - Docs: TODO add markdown docs
 * @param client - Client to use
 * @param parameters - {@link EstimateSendL2ToL2MessageGasParameters}
 * @returns Estimated gas. {@link EstimateSendL2ToL2MessageGasReturnType}
 * @example
 * import { createPublicClient, http, parseEther } from 'viem'
 * import { base, optimism } from 'viem/chains'
 * import { estimateSendL2ToL2MessageGas } from '@eth-optimism/viem'
 *
 * const client = createPublicClient({
 *   chain: optimism,
 *   transport: http(),
 * })
 *
 * const gas = await estimateSendL2ToL2MessageGas(client, {
 *   destinationChainId: base.id,
 *   target: 0x...,
 *   message: 0x...,
 * })
 */
export async function estimateSendL2ToL2MessageGas<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: EstimateSendL2ToL2MessageGasParameters<
    chain,
    account,
    chainOverride
  >,
) {
  const {
    account,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    destinationChainId,
    target,
    message,
  } = parameters

  const params = {
    account,
    abi: l2ToL2CrossDomainMessengerABI,
    address: contracts.l2ToL2CrossDomainMessenger.address as Address,
    functionName: 'sendMessage',
    args: [BigInt(destinationChainId), target, message],
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
  } satisfies EstimateContractGasParameters<
    typeof l2ToL2CrossDomainMessengerABI,
    'sendMessage'
  >
  return estimateContractGas(client, params as any)
}
