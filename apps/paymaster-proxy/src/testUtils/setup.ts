import { afterAll, afterEach, beforeAll } from 'vitest'

import { mswServer } from '@/testUtils/mswServer'

beforeAll(() => mswServer.listen())

afterAll(() => mswServer.close())

afterEach(() => mswServer.resetHandlers())
