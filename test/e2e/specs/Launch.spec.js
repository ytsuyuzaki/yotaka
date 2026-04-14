import utils from '../utils'

describe('Launch', function () {
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)

  it('shows the proper application title', async function () {
    const window = await this.app.firstWindow()
    const title = await window.title()
    expect(title).to.equal('yotaka')
  })
})
