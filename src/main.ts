import 'normalize.css'
import 'element-plus/dist/index.css'
import './style.less'
import App from './App.vue'
import routes from '~pages'
import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import directive from './directive'

const pinia = createPinia()

export const createApp = ViteSSG(
  App,
  { routes },
  async ({ app, router, isClient }) => {
    app.use(pinia)
    app.use(directive)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
    if (!isClient) {
      return
    }
    const { interceptor } = await import('./router')
    interceptor(router)
  }
)
