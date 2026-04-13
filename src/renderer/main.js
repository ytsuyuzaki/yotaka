import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

if (!process.env.IS_WEB) {
  const vueElectronModule = require('vue-electron')
  const vueElectron = vueElectronModule.default || vueElectronModule

  if (vueElectron && typeof vueElectron.install === 'function') {
    app.use(vueElectron)
  }
}

app.mount('#app')
