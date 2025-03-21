import { defineConfig } from 'eslint/config';

import uiComponentsConfig from '../eslint.config.js';

// Create a new configuration that extends the UI Components configuration
export default defineConfig([
  ...uiComponentsConfig,
]);
