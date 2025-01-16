import { execSync } from 'child_process'
import { Eta } from 'eta'
import fs from 'fs'
import path from 'path'

// Hardcoded. Can take a more elaborate approach if needed.
const OPTIMISM_PATH = path.join('..', '..', 'lib', 'optimism')
const CONTRACTS = [
  'CrossL2Inbox',
  'L2ToL2CrossDomainMessenger',
  'SuperchainERC20',
  'SuperchainWETH',
  'SuperchainTokenBridge',
]

/** Utility Functions */

function camelCase(str: string): string {
  const [start, ...rest] = str
  return start.toLowerCase() + rest.join('')
}

/** Abi Generation */

async function main() {
  console.log('Generating forge artifacts...')
  const contractsBedrockPath = path.join(
    OPTIMISM_PATH,
    'packages',
    'contracts-bedrock',
  )
  try {
    execSync('forge build', { cwd: contractsBedrockPath, stdio: 'inherit' })
  } catch (error) {
    throw new Error(`Failed to generate forge artifacts: ${error}`)
  }

  console.log('Extracting abi generation...')
  const eta = new Eta({
    views: './scripts/templates',
    debug: true,
    autoTrim: [false, false],
  })

  const contracts = CONTRACTS.map((contract) => {
    console.log(`Generating Abi for ${contract}`)
    const abiPath = path.join(
      contractsBedrockPath,
      'forge-artifacts',
      `${contract}.sol`,
      `${contract}.json`,
    )
    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8')).abi
    return { name: contract, exportName: camelCase(contract), abi }
  })

  const fileContents = eta.render('abis', {
    contracts,
    prettyPrintJSON: (obj: any) => JSON.stringify(obj, null, 2),
  })

  fs.writeFileSync(`src/abis.ts`, fileContents)
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
