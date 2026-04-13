'use strict'

const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')

const baseConfig = require('../../.electron-vue/webpack.renderer.config')
const projectRoot = path.resolve(__dirname, '../../src/renderer')

// Set BABEL_ENV to use proper preset config
process.env.BABEL_ENV = 'test'

let webpackConfig = merge(baseConfig, {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"testing"',
      'process.env': JSON.stringify({ NODE_ENV: 'testing' }),
      '__VUE_OPTIONS_API__': 'true',
      '__VUE_PROD_DEVTOOLS__': 'false',
      '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false'
    })
  ]
})

// don't treat dependencies as externals
delete webpackConfig.entry
delete webpackConfig.externals
delete webpackConfig.output.libraryTarget
webpackConfig.target = 'web'
webpackConfig.resolve.fallback = Object.assign({}, webpackConfig.resolve.fallback, {
  os: false
})
webpackConfig.plugins = webpackConfig.plugins.filter(plugin => ![
  'HtmlWebpackPlugin',
  'HotModuleReplacementPlugin',
  'NoEmitOnErrorsPlugin'
].includes(plugin.constructor.name))

// apply vue option to apply isparta-loader on js
const vueRule = webpackConfig.module.rules.find(rule => String(rule.test) === '/\\.vue$/')
const vueLoader = vueRule && Array.isArray(vueRule.use)
  ? vueRule.use.find(use => use.loader === 'vue-loader')
  : vueRule && vueRule.use
if (vueLoader && vueLoader.options && vueLoader.options.loaders) {
  vueLoader.options.loaders.js = 'babel-loader'
}

module.exports = config => {
  const browser = process.env.KARMA_BROWSER || 'jsdom'
  config.set({
    browsers: [browser],
    hostname: '127.0.0.1',
    client: {
      useIframe: true
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    customLaunchers: {
      'visibleElectron': {
        base: 'Electron',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--headless'],
        browserWindowOptions: {
          show: false
        }
      }
    },
    frameworks: ['mocha', 'chai'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    reporters: ['spec', 'coverage'],
    singleRun: true,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    }
  })
}
