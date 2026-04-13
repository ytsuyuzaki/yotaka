window.process = window.process || { env: {} }
window.process.versions = window.process.versions || {}
window.process.versions.electron = window.process.versions.electron || '0.0.0'
global.process = window.process
window.require = window.require || (name => {
  if (name === 'electron') return { shell: { openExternal: () => {} } }
  if (name === 'os') return { platform: () => 'test' }
  return {}
})

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec\.js$/)
testsContext.keys().forEach(testsContext)
