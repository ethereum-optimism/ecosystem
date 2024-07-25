import type {
  Account,
  Address,
  Chain,
  Client,
  DeriveAccount,
  DeriveChain,
  GetChainParameter,
  Hex,
  Transport,
} from 'viem'
import { parseAccount } from 'viem/accounts'

import type { GetAccountParameter, Prettify } from '@/types/utils'

export type BuildSendL2ToL2MessageParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  accountOverride extends Account | Address | undefined =
    | Account
    | Address
    | undefined,
  _derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = GetAccountParameter<account, accountOverride, false> &
  GetChainParameter<chain, chainOverride> & {
    /** Chain ID of the destination chain. */
    destinationChainId: number
    /** Target contract or wallet address. */
    target: Address
    /** Message payload to call target with. */
    message: Hex
  }

export type BuildSendL2ToL2MessageReturnType<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  accountOverride extends Account | Address | undefined =
    | Account
    | Address
    | undefined,
> = Prettify<
  Pick<
    BuildSendL2ToL2MessageParameters,
    'destinationChainId' | 'target' | 'message'
  > & {
    account: DeriveAccount<account, accountOverride>
    targetChain: DeriveChain<chain, chainOverride>
  }
>

/**
 * Builds the transaction that initiates the intent of sending a L2 to L2 message. Used in the interop flow.
 *
 * - Docs: TODO: Add markdown doc link
 * @param client - Client to use
 * @param parameters - {@link BuildSendL2ToL2MessageParameters}
 * @returns The sendL2ToL2Message transaction request. {@link BuildSendL2ToL2MessageReturnType}
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { optimism } from 'viem/chains'
 * import { buildSendL2ToL2Message } from 'viem/op-stack'
 *
 * const publicClientL2 = createPublicClient({
 *   chain: optimism,
 *   transport: http(),
 * })
 *
 * const args = await buildSendL2ToL2Message(publicClientL2, {
 *   destinationChainId: 8453,
 *   target: 0x...,
 *   message: 0x...,
 * })
 */
export async function buildSendL2ToL2Message<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
  accountOverride extends Account | Address | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  args: BuildSendL2ToL2MessageParameters<
    chain,
    account,
    chainOverride,
    accountOverride
  >,
): Promise<
  BuildSendL2ToL2MessageReturnType<
    chain,
    account,
    chainOverride,
    accountOverride
  >
> {
  const {
    account: account_,
    chain = client.chain,
    destinationChainId,
    target,
    message,
  } = args

  const account = account_ ? parseAccount(account_) : undefined

  return {
    account,
    targetChain: chain,
    destinationChainId,
    target,
    message,
  } as BuildSendL2ToL2MessageReturnType<
    chain,
    account,
    chainOverride,
    accountOverride
  >
}
