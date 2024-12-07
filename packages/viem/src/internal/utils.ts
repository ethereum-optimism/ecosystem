import fs from 'fs'

import type { Artifact } from './types.js'

export function properCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.substring(1)
}

export function camelCase(str: string): string {
  const [start, ...rest] = str
  return start.toLowerCase() + rest.join('')
}

export function fetchArtifact(registryPath: string, name: string) {
  const artifact = JSON.parse(
    fs.readFileSync(`${registryPath}/${name}.sol/${name}.json`),
  )
  return { name, ...artifact } as Artifact
}
