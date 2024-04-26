import { deepHexlify } from 'permissionless/utils'
import type { Address, Chain, Hex } from 'viem'

import { createRandomSimpleAccount } from '@/testUtils/simpleAccount/createRandomSimpleAccount'
import { simpleAccountDummySignature } from '@/testUtils/simpleAccount/simpleAccountDummySignature'

export const getUserOperationWithRandomSimpleAccount = async (
  chain: Chain,
  to: Address,
  data: Hex,
) => {
  const simpleAccount = await createRandomSimpleAccount(chain)

  const encodedCallData = await simpleAccount.encodeCallData({
    to: to,
    data: data,
    value: BigInt(0),
  })

  const userOperation = deepHexlify({
    initCode: await simpleAccount.getInitCode(),
    nonce: await simpleAccount.getNonce(),
    sender: simpleAccount.address,
    callData: encodedCallData,
    signature: simpleAccountDummySignature,
  })

  return userOperation
}
