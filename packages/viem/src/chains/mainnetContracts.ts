export const mainnetContracts = {
  // OP Mainnet (chain ID: 10)
  [10]: {
    uniV4PoolManager: { address: '0x9a13f98cb987694c9f086b1f5eb990eea8264ec3' },
    uniV4Posm: { address: '0x3c3ea4b57a46241e54610e5f022e5c45859a1017' },
    uniV4StateView: { address: '0xc18a3169788f4f75a170290584eca6395c75ecdb' },
    uniV4Router: { address: '' },
  },
  // Unichain (chain ID: 130)
  130: {
    uniV4PoolManager: { address: '0x1f98400000000000000000000000000000000004' },
    uniV4Posm: { address: '0x4529a01c7a0410167c5740c487a8de60232617bf' },
    uniV4StateView: { address: '0x86e8631a016f9068c3f085faf484ee3f5fdee8f2' },
    uniV4Router: { address: '' },
  },
} as const
