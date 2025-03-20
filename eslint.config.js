import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import storybookPlugin from 'eslint-plugin-storybook';

// Fix up plugins that might not be fully compatible with ESLint 9
const react = fixupPluginRules(reactPlugin);
const reactHooks = fixupPluginRules(reactHooksPlugin);
const reactRefresh = fixupPluginRules(reactRefreshPlugin);
const jsdoc = fixupPluginRules(jsdocPlugin);
const simpleImportSort = fixupPluginRules(simpleImportSortPlugin);
const storybook = fixupPluginRules(storybookPlugin);
const importRule = fixupPluginRules(importPlugin);
const typescript = fixupPluginRules(tseslintPlugin);

export default [
  // Base configuration
  js.configs.recommended,

  // TypeScript configuration - replace the spread with proper configuration
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescript
    },
    languageOptions: {
      parser: tseslintParser
    }
  },

  // Ignore patterns
  {
    ignores: [
      'src/assets/**/*',
      '**/build/**/*',
      '**/dist/**/*',
      '**/typechain/**/*',
      'node_modules/**',
    ],
  },

  // JavaScript and TypeScript files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      jsdoc,
      'simple-import-sort': simpleImportSort,
      import: importRule,
      '@typescript-eslint': typescript
    },
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/member-ordering': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],

      // React rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // Import rules
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // JSDoc rules
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-indentation': 'error',
      'jsdoc/tag-lines': 'error',

      // General rules
      'no-console': 'warn',
      'prefer-const': 'error',
      'eol-last': 'error',
    },
  },

  // Storybook files
  {
    files: ['**/*.stories.{js,jsx,ts,tsx}'],
    plugins: {
      storybook,
    },
    rules: {
      ...storybookPlugin.configs.recommended.rules,
    },
  },
];
