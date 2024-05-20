import { pad } from 'viem'

export const ALCHEMY_GAS_MANAGER_PAYMASTER_ADDRESS =
  '0x4f84a207a80c39e9e8bae717c1f25ba7ad1fb08f' as const

export const ALCHEMY_GAS_MANAGER_STUB_PAYMASTER_AND_DATA = pad(
  ALCHEMY_GAS_MANAGER_PAYMASTER_ADDRESS,
  {
    size: 117,
    dir: 'right',
  },
)
