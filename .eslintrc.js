module.exports = {
    extends: ['react-app', 'plugin:storybook/recommended'],
    root: true,
    ignorePatterns: ['src/assets/**/*', '**/build/**/*', '**/dist/**/*', '**/typechain/**/*'],
    plugins: [
      'simple-import-sort',
      'eslint-plugin-testing-library',
      'eslint-plugin-jsdoc',
    ],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': 'warn',
      'prefer-const': 'error',
      'testing-library/render-result-naming-convention': 'off',
      'eol-last': 'error',
  
      // START TYPESCRIPT RULES
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
      // END TYPESCRIPT RULES
  
      // REACT RULES
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      // END REACT RULES
  
      // START IMPORT LINT RULES
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      // END IMPORT LINT RULES
  
      // START JSDOC LINT RULES
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-indentation': 'error',
      'jsdoc/tag-lines': 'error',
      // END JSDOC LINT RULES
    },
  }
  