import { chainConfig } from 'viem/op-stack'

export const contracts = {
  ...chainConfig.contracts,
  l1BlockInterop: {
    address: '0x4200000000000000000000000000000000000015',
  },
  crossL2Inbox: {
    address: '0x4200000000000000000000000000000000000022',
  },
  l2ToL2CrossDomainMessenger: {
    address: '0x4200000000000000000000000000000000000023',
  },
}
