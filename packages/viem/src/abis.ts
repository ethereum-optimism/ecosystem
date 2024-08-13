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
    inputs: [],
    name: 'blockNumber',
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
    name: 'chainId',
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
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'origin',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'blockNumber',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'logIndex',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'chainId',
            type: 'uint256',
          },
        ],
        internalType: 'struct ICrossL2Inbox.Identifier',
        name: '_id',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: '_target',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_message',
        type: 'bytes',
      },
    ],
    name: 'executeMessage',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'logIndex',
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
    name: 'origin',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'timestamp',
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
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'origin',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'blockNumber',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'logIndex',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'chainId',
            type: 'uint256',
          },
        ],
        internalType: 'struct ICrossL2Inbox.Identifier',
        name: '_id',
        type: 'tuple',
      },
      {
        internalType: 'bytes32',
        name: '_msgHash',
        type: 'bytes32',
      },
    ],
    name: 'validateMessage',
    outputs: [],
    stateMutability: 'nonpayable',
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
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'msgHash',
        type: 'bytes32',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'origin',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'blockNumber',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'logIndex',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'chainId',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct ICrossL2Inbox.Identifier',
        name: 'id',
        type: 'tuple',
      },
    ],
    name: 'ExecutingMessage',
    type: 'event',
  },
  {
    inputs: [],
    name: 'InvalidChainId',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidTimestamp',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotEntered',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrantCall',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TargetCallFailed',
    type: 'error',
  },
] as const

/**
 * ABI for the OP Stack [`L2ToL2CrossDomainMessenger` contract](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L2/L2ToL2CrossDomainMessenger.sol).
 */
export const l2ToL2CrossDomainMessengerABI = [
  {
    inputs: [],
    name: 'crossDomainMessageSender',
    outputs: [
      {
        internalType: 'address',
        name: '_sender',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'crossDomainMessageSource',
    outputs: [
      {
        internalType: 'uint256',
        name: '_source',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'messageNonce',
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
    name: 'messageVersion',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_destination',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_source',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_nonce',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_sender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_target',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_message',
        type: 'bytes',
      },
    ],
    name: 'relayMessage',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_destination',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_target',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_message',
        type: 'bytes',
      },
    ],
    name: 'sendMessage',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'successfulMessages',
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
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'messageHash',
        type: 'bytes32',
      },
    ],
    name: 'FailedRelayedMessage',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'messageHash',
        type: 'bytes32',
      },
    ],
    name: 'RelayedMessage',
    type: 'event',
  },
  {
    inputs: [],
    name: 'CrossL2InboxOriginNotL2ToL2CrossDomainMessenger',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MessageAlreadyRelayed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MessageDestinationNotRelayChain',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MessageDestinationSameChain',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MessageTargetCrossL2Inbox',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MessageTargetL2ToL2CrossDomainMessenger',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotEntered',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrantCall',
    type: 'error',
  },
  {
    inputs: [],
    name: 'RelayMessageCallerNotCrossL2Inbox',
    type: 'error',
  },
] as const
