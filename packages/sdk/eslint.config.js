import { fixupPluginRules } from '@eslint/compat';
import rootConfig from '../../eslint.config.js';

// Create a new configuration that extends the root configuration
export default [
  ...rootConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/member-ordering': 'off',
      'no-console': 'off',
      'no-loop-func': 'off',
      'no-lone-blocks': 'off',
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        'assert',
        'buffer',
        'child_process',
        'cluster',
        'crypto',
        'dgram',
        'dns',
        'domain',
        'events',
        'freelist',
        'fs',
        'http',
        'https',
        'module',
        'net',
        'os',
        'path',
        'punycode',
        'querystring',
        'readline',
        'repl',
        'smalloc',
        'stream',
        'string_decoder',
        'sys',
        'timers',
        'tls',
        'tracing',
        'tty',
        'url',
        'util',
        'vm',
        'zlib',
      ],
    },
  },
];