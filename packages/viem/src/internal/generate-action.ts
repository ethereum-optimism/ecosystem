import type { Eta } from 'eta'
import type { AbiFunction } from 'viem'

import type { ViemImportType } from './abi.js'
import { parsePrimitive, parseTuple } from './abi.js'
import type { ActionViewModel, Artifact, ContractArg } from './types.js'
import { camelCase, properCase } from './utils.js'

export type GenerateActionParameters = {
  artifact: Artifact
  eta: Eta
  contractName: string
  actionName: string
  actionAbi: string
}

export async function generateAction({
  artifact,
  eta,
  contractName,
  actionName,
  actionAbi,
}: GenerateActionParameters) {
  const abi = artifact.abi
  const viemImports = new Set<ViemImportType>()

  if (!abi) {
    console.log(
      `Could not find ABI for ${contractName} skipping generating ${actionName}`,
    )
    return null
  }

  const functionName = actionAbi.split('(')[0]
  const functionAbi = abi.find(
    (item) => item.type === 'function' && item.name === functionName,
  ) as AbiFunction

  if (!functionAbi) {
    console.log(
      `Could not find abi function item skipping generating ${actionName}`,
    )
    return null
  }

  const docKey =
    Object.keys(artifact.devdoc.methods).find((signature) => {
      return signature.startsWith(functionName)
    }) ?? ''

  const userdoc = artifact.userdoc.methods[docKey]?.notice

  const contractFunctionArgs = [] as ContractArg[]
  for (const input of functionAbi.inputs) {
    const isTuple = input.type === 'tuple'

    const name = input.name?.substring(1) // remove the _ on each param
    if (!name) {
      console.log(
        `Input does not have a name skipping generating ${actionName}`,
      )
      return null
    }

    let doc: string | undefined
    let type = input.type
    let value = name
    let components: ContractArg[] | undefined

    if (isTuple) {
      const output = parseTuple({
        artifact,
        docKey,
        input: {
          type: 'tuple',
          // @ts-ignore not being inferred correctly
          components: input.components as AbiParameter[],
        },
        viemImports,
      })

      doc = docKey
        ? artifact.devdoc.methods[docKey].params[input.name as string]
        : undefined

      components = output.map((comp) => ({
        name: comp!.name,
        type: comp!.type,
        value: comp!.value,
      }))
    } else {
      const output = parsePrimitive({
        artifact,
        docKey,
        input,
        viemImports,
      })

      doc = output?.doc
      type = output!.type
      value = output!.value
    }

    contractFunctionArgs.push({
      doc,
      name,
      components,
      type,
      value,
    })
  }

  // sometimes comments are being generated with large amounts of spaces 8 or more
  // this removes the extra spaces to make it more readable
  const formattedFunctionDoc = `${userdoc?.split(/ {2,}/g).join('\n* ')}\n`

  const viewModel = {
    module: {
      name: properCase(actionName),
      variableName: actionName,
      direction: 'L2',
      viemImports: Array.from(viemImports),
      abi: {
        name: `${camelCase(contractName)}ABI`,
        contractName: `${camelCase(contractName)}`,
        contractFunctionName: functionName,
        contractFunctionDoc: formattedFunctionDoc,
        stateMutability: functionAbi.stateMutability,
        contractFunctionArgs,
      },
    },
  } as ActionViewModel

  const generateWriteContractAction = eta.render(
    'write-contract-action',
    viewModel,
  )

  return { viewModel, content: generateWriteContractAction }
}
