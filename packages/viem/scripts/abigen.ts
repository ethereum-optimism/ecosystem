import { Eta } from 'eta'
import fs from 'fs'
import path from 'path'

// Hardcoded. Can take a more elaborate approach if needed.
const OPTIMISM_PATH = path.join('..', '..', 'lib', 'optimism')
const ABI_SNAPSHOTS_PATH = path.join(OPTIMISM_PATH, 'packages', 'contracts-bedrock', 'snapshots', 'abi')
const CONTRACTS = [
  'CrossL2Inbox',
  'L2ToL2CrossDomainMessenger',
  'SuperchainWETH',
  'SuperchainERC20',
  'SuperchainTokenBridge',
]

/** Utility Functions */

function camelCase(str: string): string {
  const [start, ...rest] = str
  return start.toLowerCase() + rest.join('')
}

/** ABI Generation */

async function main() {
  console.log('Running ABI generation...')
  const eta = new Eta({ views: './scripts/templates', debug: true, autoTrim: [false, false] })

  const contracts = CONTRACTS.map((contract) => {
    const abiPath = path.join(ABI_SNAPSHOTS_PATH, `${contract}.json`)
    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'))
    return { name: contract, exportName: camelCase(contract), abi }
  })

  console.log(contracts)
  const fileContents = eta.render('abis', { contracts })
  fs.writeFileSync(`src/abis.ts`, fileContents)
}

;(async () => {
;(async () => {
  try {
    await main()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
