import { createApp } from 'vue'
import LandingPage from '@/components/LandingPage'

describe('LandingPage.vue', () => {
  let root

  beforeEach(() => {
    root = document.createElement('div')
    createApp(LandingPage).mount(root)
  })

  it('should render correct contents', () => {
    expect(root.querySelector('.title').textContent).to.contain('Welcome to your new project!')
  })

  it('renders the right-side documentation section', () => {
    expect(root.querySelector('.right-side')).to.not.be.null
  })

  it('renders a Getting Started title in the right side', () => {
    const titles = Array.from(root.querySelectorAll('.title'))
    expect(titles.some(el => el.textContent.includes('Getting Started'))).to.equal(true)
  })

  it('renders at least one doc button', () => {
    const buttons = root.querySelectorAll('button')
    expect(buttons.length).to.be.at.least(1)
  })

  it('renders the left-side section', () => {
    expect(root.querySelector('.left-side')).to.not.be.null
  })
})
