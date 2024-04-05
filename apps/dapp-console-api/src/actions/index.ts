import * as core from '@actions/core'

import { deploy } from './deploy'

export async function main(): Promise<void> {
  const constructorArgs = core.getInput('args')
  const version = core.getInput('verision')
  const target = core.getInput('target')
  const buildDir = core.getInput('buildDir')

  deploy({
    args: constructorArgs,
    version,
    buildDir,
    target,
  })
}

;(async () => {
  try {
    await main()
  } catch (e) {
    console.log(e)
  }
})()
