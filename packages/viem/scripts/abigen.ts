import { Eta } from 'eta'
import fs from 'fs'

import abigen from '../abigen.json'

type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | JSONValue[]

type AutogenContract = {
  name: string
  abi: { [x: string]: JSONValue }
}

const ARTIFACT_DIRECTORY = '../../lib/forge-artifacts'
const SRC_DIR = './src'

const eta = new Eta({ views: './scripts/templates', debug: true })

async function generateAbis() {
  const contracts = [] as AutogenContract[]
  for (const name of abigen.contracts) {
    const artifact = JSON.parse(
      fs.readFileSync(`${ARTIFACT_DIRECTORY}/${name}.sol/${name}.json`),
    )
    contracts.push({ name, abi: artifact.abi })
  }

  const generateAbiFileContents = eta.render('abis', {
    contracts,
    camelCase,
    prettyPrintJSON: (json: JSONValue) => JSON.stringify(json, null, 2),
  })

  fs.writeFileSync(`${SRC_DIR}/abis.ts`, generateAbiFileContents)
}

function camelCase(str: string): string {
  const [start, ...rest] = str
  return start.toLowerCase() + rest.join('')
}

async function main() {
  await generateAbis()
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
