#!/usr/bin/env tsx

import { writeFileSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url))

// Function to check if a specific release version exists on GitHub
async function checkVersionExists(version: string): Promise<boolean> {
  const testUrl = `https://github.com/ethereum-optimism/supersim/releases/download/${version}/supersim_Darwin_arm64.tar.gz`

  try {
    const response = await fetch(testUrl)
    return response.status === 200
  } catch (error) {
    console.error(
      `❌ Version ${version} does not exist on GitHub releases`,
      error,
    )
    return false
  }
}

async function updateSupersimVersion(version: string) {
  // First check if the version exists
  console.log(`Checking if version ${version} exists...`)
  const exists = await checkVersionExists(version)
  if (!exists) {
    console.error(`❌ Version ${version} does not exist on GitHub releases`)
    process.exit(1)
  }

  // 1. Update install.js
  const installJsPath = resolve(__dirname, '../packages/supersim/install.js')
  let installJsContent = readFileSync(installJsPath, 'utf-8')

  installJsContent = installJsContent.replace(
    /const SUPERSIM_VERSION = ['"].*['"]/,
    `const SUPERSIM_VERSION = '${version}'`,
  )

  writeFileSync(installJsPath, installJsContent)

  // 2. Update package.json version
  const packageJsonPath = resolve(
    __dirname,
    '../packages/supersim/package.json',
  )
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  packageJson.version = version
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, '  ') + '\n')

  console.log(`✅ Updated supersim version to ${version} in:`)
  console.log(`  - install.js`)
  console.log(`  - package.json`)
}

// Get version from command line argument
const version = process.argv[2]
if (!version) {
  console.error('Please provide a version number as an argument')
  process.exit(1)
}

;(async () => {
  try {
    await updateSupersimVersion(version)
  } catch (err) {
    console.error('Error updating supersim version:', err)
    process.exit(1)
  }
})()
