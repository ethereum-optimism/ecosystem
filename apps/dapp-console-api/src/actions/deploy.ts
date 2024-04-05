import fs from 'fs'

import { apiClient } from './client'

export type DeployArgs = {
  args?: string
  buildDir?: string
  target: string
  version: string
}

export async function deploy({ args, buildDir, target, version }: DeployArgs) {
  const constructorArgs = args?.split(',')

  const [contractPath, contractName] = target.split(':')
  const contractDir = contractPath.split('/')
  const contractFile = contractDir.pop() ?? ''

  const buildOutput = fs.readFileSync(
    `${buildDir}/${contractFile}/${contractName}.json`,
  )
  const buildJSON = JSON.parse(buildOutput.toString())

  const bytecode = buildJSON['bytecode']['object']
  const abi = buildJSON['abi']

  console.log(`########## Bytecode: ${contractFile}:${contractName} ##########`)
  console.log(bytecode)
  console.log('\n')

  console.log(`########## ABI: ${contractFile}:${contractName} ##########`)
  console.log(abi)
  console.log('\n')

  let hasError = false

  try {
    const res = await apiClient.deployments.triggerDeployment.mutate({
      bytecode,
      abi,
      version,
      constructorArgs,
    })
    console.log(`Contract Address: ${res.address}`)
  } catch (e) {
    console.error('Error deploying contract: ', e.message)
    console.log({ errorMessage: e.message })
    hasError = true
  }

  process.exit(hasError ? 1 : 0)
}
