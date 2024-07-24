/**
 * ABI for the OP Stack [`L1BlockInterop` contract](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L2/L1BlockInterop.sol).
 */
export const l1BlockInteropAbi = [
  {
    inputs: [],
    name: 'DEPOSITOR_ACCOUNT',
    outputs: [
      {
        internalType: 'address',
        name: 'addr_',
        type: 'address',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'baseFeeScalar',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'basefee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'batcherHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'blobBaseFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'blobBaseFeeScalar',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dependencySetSize',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'gasPayingToken',
    outputs: [
      {
        internalType: 'address',
        name: 'addr_',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: 'decimals_',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'gasPayingTokenName',
    outputs: [
      {
        internalType: 'string',
        name: 'name_',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'gasPayingTokenSymbol',
    outputs: [
      {
        internalType: 'string',
        name: 'symbol_',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'hash',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isCustomGasToken',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_chainId',
        type: 'uint256',
      },
    ],
    name: 'isInDependencySet',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'l1FeeOverhead',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'l1FeeScalar',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'number',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'sequenceNumber',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum ConfigType',
        name: '_type',
        type: 'uint8',
      },
      {
        internalType: 'bytes',
        name: '_value',
        type: 'bytes',
      },
    ],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: '_decimals',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: '_name',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '_symbol',
        type: 'bytes32',
      },
    ],
    name: 'setGasPayingToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: '_number',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: '_timestamp',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: '_basefee',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32',
      },
      {
        internalType: 'uint64',
        name: '_sequenceNumber',
        type: 'uint64',
      },
      {
        internalType: 'bytes32',
        name: '_batcherHash',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: '_l1FeeOverhead',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_l1FeeScalar',
        type: 'uint256',
      },
    ],
    name: 'setL1BlockValues',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'setL1BlockValuesEcotone',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'timestamp',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'chainId',
        type: 'uint256',
      },
    ],
    name: 'DependencyAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'chainId',
        type: 'uint256',
      },
    ],
    name: 'DependencyRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint8',
        name: 'decimals',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'name',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'symbol',
        type: 'bytes32',
      },
    ],
    name: 'GasPayingTokenSet',
    type: 'event',
  },
  {
    inputs: [],
    name: 'AlreadyDependency',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CantRemovedDependency',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DependencySetSizeTooLarge',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotDependency',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotDepositor',
    type: 'error',
  },
] as const

/**
 * ABI for the OP Stack [`CrossL2Inbox` contract](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L2/CrossL2Inbox.sol).
 */
export const crossL2InboxABI = [
  {
    type: 'function',
    name: 'blockNumber',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'chainId',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'executeMessage',
    inputs: [
      {
        name: '_id',
        type: 'tuple',
        internalType: 'struct ICrossL2Inbox.Identifier',
        components: [
          {
            name: 'origin',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'blockNumber',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'logIndex',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'timestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'chainId',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: '_target',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_message',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'logIndex',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'origin',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'timestamp',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'version',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'ExecutingMessage',
    inputs: [
      {
        name: 'encodedId',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
      {
        name: 'message',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'InvalidChainId',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidTimestamp',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NotEntered',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TargetCallFailed',
    inputs: [],
  },
] as const

/**
 * ABI for the OP Stack [`L2ToL2CrossDomainMessenger` contract](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L2/L2ToL2CrossDomainMessenger.sol).
 */
export const l2ToL2CrossDomainMessengerABI = [
  {
    type: 'function',
    name: 'crossDomainMessageSender',
    inputs: [],
    outputs: [
      {
        name: '_sender',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'crossDomainMessageSource',
    inputs: [],
    outputs: [
      {
        name: '_source',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'messageNonce',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'messageVersion',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint16',
        internalType: 'uint16',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'relayMessage',
    inputs: [
      {
        name: '_destination',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_source',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_nonce',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_sender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_target',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_message',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'sendMessage',
    inputs: [
      {
        name: '_destination',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_target',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_message',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'successfulMessages',
    inputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'version',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'FailedRelayedMessage',
    inputs: [
      {
        name: 'messageHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RelayedMessage',
    inputs: [
      {
        name: 'messageHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SentMessage',
    inputs: [
      {
        name: 'data',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
    ],
    anonymous: true,
  },
  {
    type: 'error',
    name: 'CrossL2InboxOriginNotL2ToL2CrossDomainMessenger',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MessageAlreadyRelayed',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MessageDestinationNotRelayChain',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MessageDestinationSameChain',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MessageTargetCrossL2Inbox',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MessageTargetL2ToL2CrossDomainMessenger',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NotEntered',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ReentrantCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'RelayMessageCallerNotCrossL2Inbox',
    inputs: [],
  },
] as const
