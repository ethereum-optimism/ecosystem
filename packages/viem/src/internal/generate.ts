import { Eta } from 'eta'
import fs from 'fs'
import path from 'path'

import abigen from '../../abigen.json'
import { generateAction } from './generate-action.js'
import { generateEvent } from './generate-event.js'
import type { Artifact, AutogenContract, JSONValue } from './types.js'
import { camelCase, fetchArtifact } from './utils.js'

const ARTIFACT_DIRECTORY = '../../lib/forge-artifacts'
const SRC_DIR = './src'

const eta = new Eta({ views: './templates', debug: true })
const artifacts: Record<string, Artifact> = {}

async function generateAbis() {
  const contracts = [] as AutogenContract[]
  for (const name of abigen.l2.contracts) {
    const artifact = fetchArtifact(ARTIFACT_DIRECTORY, name)
    contracts.push({ name, abi: artifact.abi })
    artifacts[name] = artifact
  }

  const generateAbiFileContents = eta.render('abis', {
    contracts,
    camelCase,
    prettyPrintJSON: (json: JSONValue) => JSON.stringify(json, null, 2),
  })

  fs.writeFileSync(`${SRC_DIR}/abis.ts`, generateAbiFileContents)
}

async function generateActions() {
  const contracts = Object.entries(abigen.l2.bindings)

  for (const [contractName, contractConfig] of contracts) {
    const artifact = artifacts[contractName]
    const actions = Object.entries(contractConfig.actions)

    for (const [actionName, actionAbi] of actions) {
      const action = await generateAction({
        artifact,
        eta,
        contractName,
        actionName,
        actionAbi,
      })

      if (action?.content) {
        const fileToWritePath = `${SRC_DIR}/generated/l2/${camelCase(contractName)}/actions/${actionName}.ts`
        fs.mkdirSync(path.dirname(fileToWritePath), { recursive: true })
        fs.writeFileSync(fileToWritePath, action.content)
      }
    }
  }
}

async function generateEvents() {
  const contracts = Object.entries(abigen.l2.bindings)

  for (const [contractName, contractConfig] of contracts) {
    const artifact = artifacts[contractName]
    const events = contractConfig.events

    for (const eventName of events) {
      const event = await generateEvent({
        artifact,
        eta,
        contractName,
        eventName,
      })

      if (event?.contents) {
        const fileToWritePath = `${SRC_DIR}/generated/l2/${camelCase(contractName)}/events/${eventName}.ts`
        fs.mkdirSync(path.dirname(fileToWritePath), { recursive: true })
        fs.writeFileSync(fileToWritePath, event.contents)
      }
    }
  }
}

async function main() {
  await generateAbis()
  await generateActions()
  await generateEvents()
}

;(async () => {
  try {
    await main()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
