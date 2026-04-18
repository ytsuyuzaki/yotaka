'use strict'

const { spawnSync } = require('child_process')
const path = require('path')

const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE

const mocha = path.join(__dirname, '..', 'node_modules', 'mocha', 'bin', 'mocha.js')
const args = [mocha, 'test/e2e']

function hasCommand (command) {
  const result = spawnSync('sh', ['-c', `command -v ${command}`], {
    encoding: 'utf8',
    stdio: 'ignore'
  })
  return result.status === 0
}

const command = process.execPath
let commandArgs = args

if (process.platform === 'linux' && !env.DISPLAY && hasCommand('xvfb-run')) {
  commandArgs = ['-a', command, ...args]
  run('xvfb-run', commandArgs)
} else {
  run(command, commandArgs)
}

function run (runner, runnerArgs) {
  const result = spawnSync(runner, runnerArgs, {
    env,
    stdio: 'inherit'
  })

  if (result.error) {
    throw result.error
  }

  process.exit(result.status)
}
