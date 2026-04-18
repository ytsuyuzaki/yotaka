import utils from '../utils'

describe('Launch', function () {
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)

  it('shows the proper application title', async function () {
    this.timeout(10000)
    const title = await this.app.evaluate(({ app }) => app.getName())
    expect(title).to.equal('yotaka')
  })
})
