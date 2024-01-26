import fs from 'fs'
import path from 'path'

import { envVarsSchema } from '../src/envVarsSchema'

// generates an example.env file based on envVarsSchema
const generateExampleEnv = () => {
  const output = envVarsSchema
    .keyof()
    .options.map((envVarKey) => {
      const validator = envVarsSchema.shape[envVarKey]
      const defaultValueParse = validator.safeParse(undefined)

      // if default value exists
      //     # default: 0.0.0.0
      //     # HOST=
      // if default value does not exist
      //     HOST=
      return [
        validator.description ? `# ${validator.description}` : undefined,
        defaultValueParse.success
          ? `# default: ${defaultValueParse.data}\n# ${envVarKey}=`
          : `${envVarKey}=`,
        // add newline
        '',
      ]
    })
    .flat()
    .filter((x) => x !== undefined)
    .join('\n')

  return `# Environment Variables Schema (generated) \n\n${output}`
}

fs.writeFileSync(
  path.join(__dirname, '..', 'example.env'),
  generateExampleEnv(),
)
