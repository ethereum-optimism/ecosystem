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

import type { MessageIdentifier } from '@/types/interop.js'
import type { GetAccountParameter, Prettify } from '@/types/utils.js'

export type BuildExecuteL2ToL2MessageParameters<
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
    /** Identifier pointing to the initiating message. */
    id: MessageIdentifier
    /** Target contract or wallet address. */
    target: Address
    /** Message payload to call target with. */
    message: Hex
  }

export type BuildExecuteL2ToL2MessageReturnType<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  accountOverride extends Account | Address | undefined =
    | Account
    | Address
    | undefined,
> = Prettify<
  Pick<BuildExecuteL2ToL2MessageParameters, 'id' | 'target' | 'message'> & {
    account: DeriveAccount<account, accountOverride>
    targetChain: DeriveChain<chain, chainOverride>
  }
>

/**
 * Builds the transaction that executes the L2 to L2 message. Used in the interop flow.
 *
 * - Docs: TODO: Add markdown doc link
 * @param client - Client to use
 * @param parameters - {@link BuildExecuteL2ToL2MessageParameters}
 * @returns The executeL2ToL2Message transaction request. {@link BuildExecuteL2ToL2MessageReturnType}
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { optimism } from 'viem/chains'
 * import { buildExecuteL2ToL2Message } from '@eth-optimism/viem'
 *
 * const publicClientL2 = createPublicClient({
 *   chain: optimism,
 *   transport: http(),
 * })
 *
 * const args = await buildExecuteL2ToL2Message(publicClientL2, {
 *   id: { ... },
 *   target: 0x...,
 *   message: 0x...,
 * })
 */
export async function buildExecuteL2ToL2Message<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
  accountOverride extends Account | Address | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  args: BuildExecuteL2ToL2MessageParameters<
    chain,
    account,
    chainOverride,
    accountOverride
  >,
): Promise<
  BuildExecuteL2ToL2MessageReturnType<
    chain,
    account,
    chainOverride,
    accountOverride
  >
> {
  const { account: account_, chain = client.chain, id, target, message } = args

  const account = account_ ? parseAccount(account_) : undefined

  return {
    account,
    targetChain: chain,
    id,
    target,
    message,
  } as BuildExecuteL2ToL2MessageReturnType<
    chain,
    account,
    chainOverride,
    accountOverride
  >
}
