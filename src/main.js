import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { createNotivue } from 'notivue'
import 'notivue/animations.css'
import 'notivue/notification.css'
import { createApp } from 'vue'
// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

const app = createApp(App)
const notivue = createNotivue({
  position: 'top-right',
  limit: 4,
  enqueue: true,
  avoidDuplicates: true,
  notifications: {
    global: {
      duration: 10000
    }
  }
});

// Register plugins
registerPlugins(app)
app.use(notivue)

// Mount vue app
app.mount('#app')
