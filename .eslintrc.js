module.exports = {
  env: {
    browser: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: ['plugin:prettier/recommended', 'prettier/@typescript-eslint'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/class-name-casing': 'error',
    curly: 'error',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        avoidEscape: true
      }
    ],

    '@typescript-eslint/interface-name-prefix': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    'default-case': 'warn',
    'use-isnan': 'error',
    'new-parens': 'error',
    'no-debugger': 'error',
    'no-eval': 'error',
    'no-fallthrough': 'error',
    'no-trailing-spaces': 'error',
    'no-unused-expressions': 'warn',
    'no-bitwise': 'error',
    'no-cond-assign': 'error',
    'no-var': 'error',
    'no-console': [
      'warn',
      {
        allow: [
          'warn',
          'dir',
          'timeLog',
          'assert',
          'clear',
          'count',
          'countReset',
          'group',
          'groupEnd',
          'table',
          'dirxml',
          'error',
          'groupCollapsed',
          'Console',
          'profile',
          'profileEnd',
          'timeStamp',
          'context'
        ]
      }
    ],
    eqeqeq: ['error', 'smart'],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 3
      }
    ],
    'no-return-await': 'error',

    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/ban-types': 'error'
  }
};
