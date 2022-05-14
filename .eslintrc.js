module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'es2021': true
  },
  globals: {
    VM_HOST: true,
    BACKEND_PORT: true,
    IS_PROD: true,
    VERSION: true,
    BUILD_NUM: true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'js': true,
      'jsx': true
    },
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'ignorePatterns': [
    'webStormSettings'
  ],
  'rules': {
    'indent': [
      'error',
      2,
      {
        "SwitchCase": 1
      }
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'no-console': [
      'warn'
    ],
    'no-unused-vars': [
      'warn'
    ],
    'react/react-in-jsx-scope' : 0,
    'react/jsx-no-target-blank': 0,
  }
}
