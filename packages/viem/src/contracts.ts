import { contracts as existingContracts } from 'viem/op-stack/contracts'

export const contracts = {
  ...existingContracts,
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
