module.exports = {
    extends: ['../../.eslintrc.js'],
    ignorePatterns: ['build', '.eslintrc.cjs'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '_', argsIgnorePattern: '_' },
      ],
    },
  }
  