module.exports = {
  extends: ['standard-with-typescript', 'prettier'],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'space-before-function-paren': 'off'
  }
}
