import type { Abi, AbiStateMutability } from 'viem'

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | JSONValue[]

export type AutogenContract = {
  name: string
  abi: Abi
}

export type ContractArg = {
  doc?: string
  name: string
  type: string
  value: string
  components?: ContractArg[]
}

export type DevdocMethods =
  | {
      methods: Record<
        string,
        {
          params: Record<string, string>
        }
      >
    }
  | {
      events: Record<
        string,
        {
          params: Record<string, string>
        }
      >
    }

export type UserdocMethods =
  | {
      methods: Record<
        string,
        {
          notice: string
        }
      >
    }
  | {
      events: Record<
        string,
        {
          params: Record<string, string>
        }
      >
    }

export type Artifact = {
  abi: Abi
  name: string
  devdoc: DevdocMethods
  userdoc: UserdocMethods
}

export type ActionViewModel = {
  module: {
    name: string
    variableName: string
    direction: 'L1' | 'L2'
    viemImports: string[]
    abi: {
      name: string
      contractName: string
      contractFunctionName: string
      contractFunctionDoc: string
      contractFunctionArgs: ContractArg[]
      stateMutability: AbiStateMutability
    }
  }
}

export type EventViewModel = {
  module: {
    abi: {
      name: string
      event: {
        name: string
      }
    }
  }
}
