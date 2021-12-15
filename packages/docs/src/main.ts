import { ViteSSG } from 'vite-ssg'
// import 'virtual:api'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'

// plugins
import { useI18n } from './plugins/i18n'
// import { usePwa } from './plugins/pwa'
import { pinia, usePinia } from './plugins/pinia'
import { useVuetify } from './plugins/vuetify'
import { useLocaleStore } from './store/locale'

// styles
import 'prism-theme-vars/base.css'
import { useUserStore } from './store/user'
import { useGlobalComponents } from './plugins/global-components'

const routes = setupLayouts(generatedRoutes)

const localeStore = useLocaleStore(pinia)
const userStore = useUserStore(pinia)

localeStore.$subscribe((_, state) => {
  console.log('updating locale storage', state.locale)
  window.localStorage.setItem('currentLocale', state.locale)
})

userStore.$subscribe((_, state) => {
  console.log('updating user store', state)
  window.localStorage.setItem('vuetify@user', JSON.stringify(state))
})

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    routes: [
      {
        path: '/',
        redirect: () => {
          return { path: `/${localeStore.locale}` }
        },
      },
      ...routes,
    ],
  },
  ctx => {
    useGlobalComponents(ctx)
    useI18n(ctx)
    // usePwa(ctx)
    usePinia(ctx)
    useVuetify(ctx)
  },
)