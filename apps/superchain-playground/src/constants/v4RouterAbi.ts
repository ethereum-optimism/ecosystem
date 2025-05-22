export const v4RouterAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_poolManager',
        type: 'address',
        internalType: 'contract IPoolManager',
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    name: 'executeActions',
    inputs: [{ name: 'params', type: 'bytes', internalType: 'bytes' }],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'executeActionsAndSweepExcessETH',
    inputs: [{ name: 'params', type: 'bytes', internalType: 'bytes' }],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'msgSender',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'poolManager',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'contract IPoolManager' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'unlockCallback',
    inputs: [{ name: 'data', type: 'bytes', internalType: 'bytes' }],
    outputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  { type: 'error', name: 'ContractLocked', inputs: [] },
  {
    type: 'error',
    name: 'DeltaNotNegative',
    inputs: [{ name: 'currency', type: 'address', internalType: 'Currency' }],
  },
  {
    type: 'error',
    name: 'DeltaNotPositive',
    inputs: [{ name: 'currency', type: 'address', internalType: 'Currency' }],
  },
  { type: 'error', name: 'InputLengthMismatch', inputs: [] },
  { type: 'error', name: 'InsufficientBalance', inputs: [] },
  { type: 'error', name: 'InvalidBips', inputs: [] },
  { type: 'error', name: 'NotPoolManager', inputs: [] },
  {
    type: 'error',
    name: 'UnsupportedAction',
    inputs: [{ name: 'action', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'V4TooLittleReceived',
    inputs: [
      {
        name: 'minAmountOutReceived',
        type: 'uint256',
        internalType: 'uint256',
      },
      { name: 'amountReceived', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'V4TooMuchRequested',
    inputs: [
      {
        name: 'maxAmountInRequested',
        type: 'uint256',
        internalType: 'uint256',
      },
      { name: 'amountRequested', type: 'uint256', internalType: 'uint256' },
    ],
  },
] as const
