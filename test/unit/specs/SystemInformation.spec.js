import { createApp } from 'vue'
import SystemInformation from '@/components/LandingPage/SystemInformation'

describe('SystemInformation.vue', () => {
  let root

  beforeEach(() => {
    root = document.createElement('div')
    createApp(SystemInformation).mount(root)
  })

  it('renders the Information title', () => {
    expect(root.querySelector('.title').textContent).to.contain('Information')
  })

  it('renders four information items', () => {
    expect(root.querySelectorAll('.item')).to.have.lengthOf(4)
  })

  it('each item has a name and a value element', () => {
    const items = root.querySelectorAll('.item')
    items.forEach(item => {
      expect(item.querySelector('.name')).to.not.be.null
      expect(item.querySelector('.value')).to.not.be.null
    })
  })

  it('displays a Vue.js label', () => {
    const names = Array.from(root.querySelectorAll('.item .name')).map(el => el.textContent)
    expect(names.some(n => n.includes('Vue.js'))).to.equal(true)
  })

  it('displays an Electron label', () => {
    const names = Array.from(root.querySelectorAll('.item .name')).map(el => el.textContent)
    expect(names.some(n => n.includes('Electron'))).to.equal(true)
  })

  it('displays a Node label', () => {
    const names = Array.from(root.querySelectorAll('.item .name')).map(el => el.textContent)
    expect(names.some(n => n.includes('Node'))).to.equal(true)
  })

  it('displays a Platform label', () => {
    const names = Array.from(root.querySelectorAll('.item .name')).map(el => el.textContent)
    expect(names.some(n => n.includes('Platform'))).to.equal(true)
  })

  it('shows the mocked platform value', () => {
    const values = Array.from(root.querySelectorAll('.item .value')).map(el => el.textContent)
    expect(values.some(v => v.includes('test'))).to.equal(true)
  })

  it('shows the mocked electron version', () => {
    const values = Array.from(root.querySelectorAll('.item .value')).map(el => el.textContent)
    expect(values.some(v => v.includes('0.0.0'))).to.equal(true)
  })
})
