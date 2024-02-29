import { z } from 'zod'

const envVarSchema = z.object({
  PORT: z.number(),
})

const isTest = process.env.NODE_ENV === 'test'

/**
 * A typesafe wrapper around process.env that sets defaults
 */
export const envVars = envVarSchema.parse(
  isTest
    ? {
        /**
         * We want the env vars in tests to always be consistent
         * To change them consider mocking them explicitly in test
         * rather than using env file
         * @example
         * jest.mock('../constants/envVars', () => ({
         *  envVars: {
         *      MOCKED_VARIABLE: true
         * }))
         */
        PORT: 7300,
      }
    : {
        PORT: process.env.PORT
          ? Number(process.env.PORT)
          : process.env.SERVER_PORT
            ? Number(process.env.SERVER_PORT)
            : 7300,
      },
)
