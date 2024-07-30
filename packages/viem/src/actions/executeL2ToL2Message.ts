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

import { crossL2InboxABI } from '@/abis.js'
import type {
  EstimateExecuteL2ToL2MessageGasErrorType,
  EstimateExecuteL2ToL2MessageGasParameters,
} from '@/actions/estimateExecuteL2ToL2MessageGas.js'
import { estimateExecuteL2ToL2MessageGas } from '@/actions/estimateExecuteL2ToL2MessageGas.js'
import { contracts } from '@/contracts.js'
import type { MessageIdentifier } from '@/types/interop.js'
import type {
  ErrorType,
  GetAccountParameter,
  UnionEvaluate,
} from '@/types/utils.js'

export type ExecuteL2ToL2MessageParameters<
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
    /** Identifier pointing to the initiating message. */
    id: MessageIdentifier
    /** Target contract or wallet address. */
    target: Address
    /** Message payload to call target with. */
    message: Hex
  }
export type ExecuteL2ToL2MessageReturnType = Hash
export type ExecuteL2ToL2MessageErrorType =
  | EstimateExecuteL2ToL2MessageGasErrorType
  | WriteContractErrorType
  | ErrorType

/**
 * Executes the L2 to L2 message. Used in the interop flow.
 *
 * - Docs: TODO add markdown docs
 * @param client - Client to use
 * @param parameters - {@link ExecuteL2ToL2MessageParameters}
 * @returns The executeL2ToL2Message transaction hash. {@link ExecuteL2ToL2MessageReturnType}
 * @example
 * import { createWalletClient, http } from 'viem'
 * import { optimism } from 'viem/chains'
 * import { executeL2ToL2Message } from '@eth-optimism/viem'
 *
 * const walletClientL1 = createWalletClient({
 *   chain: optimism,
 *   transport: http(),
 * })
 *
 * const request = await executeL2ToL2Message(walletClientL1, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   targetChain: optimism,
 *   id: { ... },
 *   target: 0x...,
 *   message: 0x...,
 * })
 */
export async function executeL2ToL2Message<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: ExecuteL2ToL2MessageParameters<chain, account, chainOverride>,
): Promise<ExecuteL2ToL2MessageReturnType> {
  const {
    account,
    chain = client.chain,
    gas,
    id,
    target,
    message,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
  } = parameters

  const gas_ =
    typeof gas !== 'bigint' && gas !== null
      ? await estimateExecuteL2ToL2MessageGas(
          client,
          parameters as EstimateExecuteL2ToL2MessageGasParameters,
        )
      : gas ?? undefined

  return writeContract(client, {
    account: account!,
    abi: crossL2InboxABI,
    address: contracts.crossL2Inbox.address,
    chain,
    functionName: 'executeMessage',
    args: [id, target, message],
    gas: gas_,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
  } satisfies WriteContractParameters as any)
}
