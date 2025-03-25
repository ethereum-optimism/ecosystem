module.exports = {
    extends: ['../../.eslintrc.js'],
    ignorePatterns: ['build', 'dist', '.eslintrc.cjs'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '_', argsIgnorePattern: '_' },
      ],
    },
  }
