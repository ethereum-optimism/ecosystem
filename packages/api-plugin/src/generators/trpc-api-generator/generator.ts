import type { Tree } from '@nx/devkit'
import { addProjectConfiguration, formatFiles, generateFiles } from '@nx/devkit'
import * as path from 'path'

import type { GeneratorOptions } from './schema'

export async function trpcApiGeneratorGenerator(
  tree: Tree,
  options: GeneratorOptions,
) {
  const projectRoot = `${options.filePath}/${options.name}`
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  })
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options)
  await formatFiles(tree)
}

export default trpcApiGeneratorGenerator
