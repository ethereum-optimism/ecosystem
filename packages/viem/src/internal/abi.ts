import type {
  SolidityAddress,
  SolidityArrayWithTuple,
  SolidityBool,
  SolidityBytes,
  SolidityInt,
  SolidityString,
  SolidityTuple,
} from 'abitype'
import type { AbiParameter } from 'viem'

import type { Artifact } from './types.js'

export type ViemImportType = 'Address' | 'Hex'
export type AbiPrimitiveTypes = SolidityInt | SolidityString | SolidityBool
export type TypescriptPrimitiveTypes =
  | 'BigInt'
  | 'number'
  | 'boolean'
  | 'string'
export type TypescriptTypes = TypescriptPrimitiveTypes | ViemImportType

export const primitiveMappingTypes: Record<
  AbiPrimitiveTypes,
  TypescriptPrimitiveTypes
> = {
  uint8: 'number',
  uint16: 'number',
  uint24: 'number',
  uint32: 'number',
  uint40: 'BigInt',
  uint48: 'BigInt',
  uint56: 'BigInt',
  uint64: 'BigInt',
  uint72: 'BigInt',
  uint80: 'BigInt',
  uint88: 'BigInt',
  uint96: 'BigInt',
  uint104: 'BigInt',
  uint112: 'BigInt',
  uint120: 'BigInt',
  uint128: 'BigInt',
  uint136: 'BigInt',
  uint144: 'BigInt',
  uint152: 'BigInt',
  uint160: 'BigInt',
  uint168: 'BigInt',
  uint176: 'BigInt',
  uint184: 'BigInt',
  uint192: 'BigInt',
  uint200: 'BigInt',
  uint208: 'BigInt',
  uint216: 'BigInt',
  uint224: 'BigInt',
  uint232: 'BigInt',
  uint240: 'BigInt',
  uint248: 'BigInt',
  uint256: 'BigInt',
  uint: 'BigInt',

  int8: 'number',
  int16: 'number',
  int24: 'number',
  int32: 'number',
  int40: 'BigInt',
  int48: 'BigInt',
  int56: 'BigInt',
  int64: 'BigInt',
  int72: 'BigInt',
  int80: 'BigInt',
  int88: 'BigInt',
  int96: 'BigInt',
  int104: 'BigInt',
  int112: 'BigInt',
  int120: 'BigInt',
  int128: 'BigInt',
  int136: 'BigInt',
  int144: 'BigInt',
  int152: 'BigInt',
  int160: 'BigInt',
  int168: 'BigInt',
  int176: 'BigInt',
  int184: 'BigInt',
  int192: 'BigInt',
  int200: 'BigInt',
  int208: 'BigInt',
  int216: 'BigInt',
  int224: 'BigInt',
  int232: 'BigInt',
  int240: 'BigInt',
  int248: 'BigInt',
  int256: 'BigInt',
  int: 'BigInt',

  bool: 'boolean',
  string: 'string',
}

export const viemMappingTypes: Record<
  SolidityAddress | SolidityBytes,
  ViemImportType
> = {
  address: 'Address',
  bytes1: 'Hex',
  bytes2: 'Hex',
  bytes3: 'Hex',
  bytes4: 'Hex',
  bytes5: 'Hex',
  bytes6: 'Hex',
  bytes7: 'Hex',
  bytes8: 'Hex',
  bytes9: 'Hex',
  bytes10: 'Hex',
  bytes11: 'Hex',
  bytes12: 'Hex',
  bytes13: 'Hex',
  bytes14: 'Hex',
  bytes15: 'Hex',
  bytes16: 'Hex',
  bytes17: 'Hex',
  bytes18: 'Hex',
  bytes19: 'Hex',
  bytes20: 'Hex',
  bytes21: 'Hex',
  bytes22: 'Hex',
  bytes23: 'Hex',
  bytes24: 'Hex',
  bytes25: 'Hex',
  bytes26: 'Hex',
  bytes27: 'Hex',
  bytes28: 'Hex',
  bytes29: 'Hex',
  bytes30: 'Hex',
  bytes31: 'Hex',
  bytes32: 'Hex',
  bytes: 'Hex',
}

export const convenienceNumberToBigIntTypes: Record<string, TypescriptTypes> = {
  chainId: 'number',
  destination: 'number',
}

export const convenienceNumberToBigIntValues: Record<string, string> = {
  chainId: 'BigInt(chainId)',
  destination: 'BigInt(destination)',
}

export type ParsePrimitiveParameters = {
  artifact: Artifact
  docKey?: string
  input: AbiParameter
  viemImports?: Set<ViemImportType>
  ignoreConvenience?: boolean
  isEvent?: boolean
}

export type ParsePrimitiveReturnType =
  | {
      type: TypescriptTypes
      doc: string | undefined
      name: string
      value: string
    }
  | undefined

export function parsePrimitive({
  artifact,
  docKey,
  input,
  viemImports,
  ignoreConvenience = false,
  isEvent = false,
}: ParsePrimitiveParameters): ParsePrimitiveReturnType {
  const name =
    input.name?.charAt(0) === '_'
      ? input.name?.substring(1)
      : (input.name as string)

  let type = primitiveMappingTypes[
    input.type as AbiPrimitiveTypes
  ] as TypescriptTypes
  let value = name as string

  if (
    !ignoreConvenience &&
    type === 'BigInt' &&
    convenienceNumberToBigIntTypes[name]
  ) {
    type = convenienceNumberToBigIntTypes[name]
    value = convenienceNumberToBigIntValues[name]
  }

  if (viemMappingTypes.hasOwnProperty(input.type)) {
    type = viemMappingTypes[input.type as SolidityAddress | SolidityBytes]
    viemImports?.add(type)
  }

  const docLocation = isEvent ? artifact.devdoc.events : artifact.devdoc.methods

  return {
    type,
    value,
    name,
    doc: docKey ? docLocation[docKey]?.params[input.name as string] : undefined,
  }
}

export type ParseAbiTupleParameters = {
  artifact: Artifact
  docKey?: string
  input: {
    type: SolidityTuple | SolidityArrayWithTuple
    components: AbiParameter[]
  }
  viemImports?: Set<ViemImportType>
}

export type ParseAbiTupleParameterReturnType = ParsePrimitiveReturnType[]

export function parseTuple({
  artifact,
  docKey,
  input,
  viemImports,
}: ParseAbiTupleParameters): ParseAbiTupleParameterReturnType {
  return input.components.map((item: AbiParameter) => {
    return parsePrimitive({ artifact, docKey, input: item, viemImports })
  })
}
