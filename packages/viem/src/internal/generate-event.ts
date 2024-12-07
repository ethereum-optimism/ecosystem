import type { Eta } from 'eta'
import type { AbiEvent } from 'viem'

import type { ViemImportType } from './abi.js'
import { parsePrimitive } from './abi.js'
import type { Artifact, EventViewModel } from './types.js'
import { camelCase } from './utils.js'

export type GenerateEventParameters = {
  artifact: Artifact
  eta: Eta
  contractName: string
  eventName: string
}

export async function generateEvent({
  artifact,
  eta,
  contractName,
  eventName,
}: GenerateEventParameters) {
  const viemImports = new Set<ViemImportType>()

  const eventAbi = artifact.abi.find(
    (item) => item.type === 'event' && item.name === eventName,
  ) as AbiEvent

  if (!eventAbi) {
    console.log(`Skipping generating ${eventName} cannot find abi`)
    return null
  }

  const docKey =
    Object.keys(artifact.devdoc.events).find((signature) => {
      return signature.startsWith(eventName)
    }) ?? ''

  const eventArgs = eventAbi.inputs.map((input) => {
    const s = parsePrimitive({
      artifact,
      docKey,
      input,
      viemImports,
      ignoreConvenience: true,
      isEvent: true,
    })
    console.log(s)
    return s
  })

  const viewModel = {
    module: {
      viemImports,
      abi: {
        doc: artifact.userdoc.events[docKey]?.notice,
        name: `${camelCase(contractName)}ABI`,
        event: {
          name: eventName,
          args: eventArgs,
        },
      },
    },
  } as EventViewModel

  const contents = eta.render('contract-event', viewModel)

  return { viewModel, contents }
}
