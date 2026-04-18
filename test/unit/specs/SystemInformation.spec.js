import { createApp } from 'vue'
import SystemInformation from '@/components/LandingPage/SystemInformation'

describe('SystemInformation.vue', () => {
  let root
  let itemNames
  let itemValues

  beforeEach(() => {
    root = document.createElement('div')
    createApp(SystemInformation).mount(root)
    itemNames = Array.from(root.querySelectorAll('.item .name')).map(el => el.textContent)
    itemValues = Array.from(root.querySelectorAll('.item .value')).map(el => el.textContent)
  })

  it('renders the Information title', () => {
    expect(root.querySelector('.title').textContent).to.contain('Information')
  })

  it('renders four information items', () => {
    expect(root.querySelectorAll('.item')).to.have.lengthOf(4)
  })

  it('each item has a name and a value element', () => {
    root.querySelectorAll('.item').forEach(item => {
      expect(item.querySelector('.name')).to.not.be.null
      expect(item.querySelector('.value')).to.not.be.null
    })
  })

  it('displays a Vue.js label', () => {
    expect(itemNames.some(n => n.includes('Vue.js'))).to.equal(true)
  })

  it('displays an Electron label', () => {
    expect(itemNames.some(n => n.includes('Electron'))).to.equal(true)
  })

  it('displays a Node label', () => {
    expect(itemNames.some(n => n.includes('Node'))).to.equal(true)
  })

  it('displays a Platform label', () => {
    expect(itemNames.some(n => n.includes('Platform'))).to.equal(true)
  })

  it('shows the mocked platform value', () => {
    expect(itemValues.some(v => v.includes('test'))).to.equal(true)
  })

  it('shows the mocked electron version', () => {
    expect(itemValues.some(v => v.includes('0.0.0'))).to.equal(true)
  })
})
