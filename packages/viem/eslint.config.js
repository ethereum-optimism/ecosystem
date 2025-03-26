import { defineConfig } from 'eslint/config';

import rootConfig from '../../eslint.config.js';

// Create a new configuration that extends the root configuration
export default defineConfig([
  ...rootConfig,
  {
    ignores: ['build', '**/dist/**'],
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '_', argsIgnorePattern: '_' },
      ],
    },
  }
]);
