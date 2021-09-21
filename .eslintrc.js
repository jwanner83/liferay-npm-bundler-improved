module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: [
    'examples/*',
    'bin/*',
    'dist/*',
    'src/templates/*'
  ]
}
