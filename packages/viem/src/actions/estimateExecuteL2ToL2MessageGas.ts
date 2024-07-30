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

import { crossL2InboxABI } from '@/abis.js'
import { contracts } from '@/contracts.js'
import type { MessageIdentifier } from '@/types/interop.js'
import type {
  ErrorType,
  GetAccountParameter,
  UnionEvaluate,
} from '@/types/utils.js'

export type EstimateExecuteL2ToL2MessageGasParameters<
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
    /** Identifier pointing to the initiating message. */
    id: MessageIdentifier
    /** Target contract or wallet address. */
    target: Address
    /** Message payload to call target with. */
    message: Hex
  }
export type EstimateExecuteL2ToL2MessageGasReturnType = bigint
export type EstimateExecuteL2ToL2MessageGasErrorType =
  | EstimateContractGasErrorType
  | ErrorType

/**
 * Estimates gas required to execute the L2 to L2 message. Used in the interop flow.
 *
 * - Docs: TODO add markdown docs
 * @param client - Client to use
 * @param parameters - {@link EstimateExecuteL2ToL2MessageGasParameters}
 * @returns Estimated gas. {@link EstimateExecuteL2ToL2MessageGasReturnType}
 * @example
 * import { createPublicClient, http, parseEther } from 'viem'
 * import { base, optimism } from 'viem/chains'
 * import { estimateExecuteL2ToL2MessageGas } from '@eth-optimism/viem'
 *
 * const client = createPublicClient({
 *   chain: optimism,
 *   transport: http(),
 * })
 *
 * const gas = await estimateExecuteL2ToL2MessageGas(client, {
 *   id: { ... },
 *   target: 0x...,
 *   message: 0x...,
 * })
 */
export async function estimateExecuteL2ToL2MessageGas<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: EstimateExecuteL2ToL2MessageGasParameters<
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
    id,
    target,
    message,
  } = parameters

  const params = {
    account,
    abi: crossL2InboxABI,
    address: contracts.crossL2Inbox.address as Address,
    functionName: 'executeMessage',
    args: [id, target, message],
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
  } satisfies EstimateContractGasParameters<
    typeof crossL2InboxABI,
    'executeMessage'
  >
  return estimateContractGas(client, params as any)
}
