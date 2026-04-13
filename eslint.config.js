const vueParser = require('vue-eslint-parser')

const baseGlobals = {
  __static: 'readonly',
  __url: 'readonly',
  __port: 'readonly'
}

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'test/unit/coverage/**',
      'test/unit/*.js',
      'test/e2e/*.js'
    ]
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: baseGlobals
    },
    rules: {
      'arrow-parens': 'off',
      'generator-star-spacing': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        sourceType: 'module'
      },
      globals: baseGlobals
    },
    rules: {
      'arrow-parens': 'off',
      'generator-star-spacing': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  }
]
