import fs from 'fs'
import path from 'path'

import { envVarsSchema } from '../src/constants/envVarsSchema'

// generates an example.env file based on envVarsSchema
const generateExampleEnv = () => {
  const output = Object.entries(envVarsSchema)
    .flatMap(([envVarKey, validator]) => {
      return [
        validator.description ? `# ${validator.description}` : undefined,
        validator.schema.isOptional() ? `# ℹ️ optional` : `# 🔴 REQUIRED`,
        `${envVarKey}=`,
        // add newline
        '',
      ]
    })
    .filter((x) => x !== undefined)
    .join('\n')

  return `${[
    '#####################################',
    '# Environment Variables (generated) #',
    '#####################################',
  ].join('\n')} \n\n${output}`
}

fs.writeFileSync(
  path.join(__dirname, '..', 'example.env'),
  generateExampleEnv(),
)
