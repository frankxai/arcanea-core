module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended'
  ],
  env: {
    node: true,
    es2020: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    // Disable rules that conflict with our AI Guardian architecture
    '@typescript-eslint/no-explicit-any': 'off', // Allow any for Guardian flexibility
    '@typescript-eslint/no-unused-vars': 'warn', // Warn instead of error
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    
    // Enforce good practices
    'no-console': 'off', // Allow console for Guardian debugging
    'prefer-const': 'warn',
    'no-var': 'error',
    'eqeqeq': 'error',
    'curly': 'error'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '**/*.js' // Ignore compiled JS files
  ]
}