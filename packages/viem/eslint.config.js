import { fixupPluginRules } from '@eslint/compat';
import rootConfig from '../../eslint.config.js';

// Create a new configuration that extends the root configuration
export default [
  ...rootConfig,
  {
    ignores: ['build'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '_', argsIgnorePattern: '_' },
      ],
    },
  },
];