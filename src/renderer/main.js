import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

if (!process.env.IS_WEB) {
  const vueElectron = require('vue-electron')
  app.use(vueElectron.default || vueElectron)
}

app.mount('#app')
