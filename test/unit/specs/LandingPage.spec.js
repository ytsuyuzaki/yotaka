import { createApp } from 'vue'
import LandingPage from '@/components/LandingPage'

describe('LandingPage.vue', () => {
  it('should render correct contents', () => {
    const root = document.createElement('div')
    createApp(LandingPage).mount(root)
    expect(root.querySelector('.title').textContent).to.contain('Welcome to your new project!')
  })
})
