import { Address } from "viem";

export const L2ToL2CrossDomainMessengerAddress = '0x4200000000000000000000000000000000000023' as Address

export const L2ToL2CrossDomainMessengerABI = [
    {
      "type": "function",
      "name": "crossDomainMessageSender",
      "inputs": [],
      "outputs": [
        {
          "name": "_sender",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "crossDomainMessageSource",
      "inputs": [],
      "outputs": [
        {
          "name": "_source",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "messageNonce",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "messageVersion",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint16",
          "internalType": "uint16"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "relayMessage",
      "inputs": [
        {
          "name": "_destination",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_source",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_nonce",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_sender",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_target",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_message",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "sendMessage",
      "inputs": [
        {
          "name": "_destination",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_target",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_message",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "successfulMessages",
      "inputs": [
        {
          "name": "",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "version",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "string",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "FailedRelayedMessage",
      "inputs": [
        {
          "name": "messageHash",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RelayedMessage",
      "inputs": [
        {
          "name": "messageHash",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "SentMessage",
      "inputs": [
        {
          "name": "data",
          "type": "bytes",
          "indexed": false,
          "internalType": "bytes"
        }
      ],
      "anonymous": true
    },
    {
      "type": "error",
      "name": "CrossL2InboxOriginNotL2ToL2CrossDomainMessenger",
      "inputs": []
    },
    {
      "type": "error",
      "name": "MessageAlreadyRelayed",
      "inputs": []
    },
    {
      "type": "error",
      "name": "MessageDestinationNotRelayChain",
      "inputs": []
    },
    {
      "type": "error",
      "name": "MessageDestinationSameChain",
      "inputs": []
    },
    {
      "type": "error",
      "name": "MessageTargetCrossL2Inbox",
      "inputs": []
    },
    {
      "type": "error",
      "name": "MessageTargetL2ToL2CrossDomainMessenger",
      "inputs": []
    },
    {
      "type": "error",
      "name": "NotEntered",
      "inputs": []
    },
    {
      "type": "error",
      "name": "ReentrantCall",
      "inputs": []
    },
    {
      "type": "error",
      "name": "RelayMessageCallerNotCrossL2Inbox",
      "inputs": []
    }
  ] as const