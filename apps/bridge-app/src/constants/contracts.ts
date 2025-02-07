export const TIC_TAC_TOE_CONTRACT_ADDRESS = import.meta.env
  .VITE_TIC_TAC_TOE_ADDRESS

export enum TicTacToeGameState {
  WaitingForPlayer = 0,
  Playing,
  Draw,
  PlayerOneWins,
  PlayerTwoWins,
}

export enum TicTacToePlayerTurn {
  PlayerOne = 0,
  PlayerTwo,
}

export const ticTacToeABI = [
  {
    type: 'function',
    name: 'checkForWin',
    inputs: [
      {
        name: 'player',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'gameId',
        type: 'uint256',
        internalType: 'uint256',
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
    name: 'createGame',
    inputs: [
      {
        name: 'player1',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'games',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'id',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'state',
        type: 'uint8',
        internalType: 'enum TicTacToe.GameState',
      },
      {
        name: 'player1',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'player2',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'currentTurn',
        type: 'uint8',
        internalType: 'enum TicTacToe.PlayerTurn',
      },
      {
        name: 'numOfTurns',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getGame',
    inputs: [
      {
        name: 'gameId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct TicTacToe.Game',
        components: [
          {
            name: 'id',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'state',
            type: 'uint8',
            internalType: 'enum TicTacToe.GameState',
          },
          {
            name: 'player1',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'player2',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'currentTurn',
            type: 'uint8',
            internalType: 'enum TicTacToe.PlayerTurn',
          },
          {
            name: 'numOfTurns',
            type: 'uint8',
            internalType: 'uint8',
          },
          {
            name: 'board',
            type: 'uint8[3][3]',
            internalType: 'uint8[3][3]',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'joinGame',
    inputs: [
      {
        name: 'player2',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'gameId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'makeMove',
    inputs: [
      {
        name: 'player',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'gameId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'x',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'y',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'GameCompletedDraw',
    inputs: [
      {
        name: 'gameId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GameCompletedWithWinner',
    inputs: [
      {
        name: 'gameId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'winner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GameCreated',
    inputs: [
      {
        name: 'gameId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'creator',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PlayerJoinedGame',
    inputs: [
      {
        name: 'gameId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'player',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PlayerMadeMove',
    inputs: [
      {
        name: 'gameId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'x',
        type: 'uint8',
        indexed: false,
        internalType: 'uint8',
      },
      {
        name: 'y',
        type: 'uint8',
        indexed: false,
        internalType: 'uint8',
      },
    ],
    anonymous: false,
  },
] as const
