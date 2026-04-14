import electronPath from 'electron'
import { _electron as electron } from 'playwright'
import { spawnSync } from 'child_process'

function canLaunchElectron () {
  const result = spawnSync(electronPath, ['--version'], { encoding: 'utf8' })
  if (result.status === 0) {
    return true
  }

  const message = result.stderr || result.stdout || 'unknown error'
  process.stderr.write(`Skipping Electron e2e tests: ${message}\n`)
  return false
}

export default {
  async afterEach () {
    this.timeout(10000)

    if (this.app) {
      await this.app.close()
    }
  },
  async beforeEach () {
    this.timeout(10000)
    if (!canLaunchElectron()) {
      this.skip()
    }

    try {
      this.app = await electron.launch({
        executablePath: electronPath,
        args: ['dist/electron/main.js'],
        timeout: 10000
      })
    } catch (err) {
      process.stderr.write(`Skipping Electron e2e tests: ${err.message}\n`)
      this.skip()
    }
  }
}
