import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import { remote } from 'electron'
import jetpack from 'fs-jetpack'
import Store from 'electron-store'
import VueCarousel from 'vue-carousel'
import iView from 'iView'
import 'iview/dist/styles/iview.css'

// import './helpers/external_links.js'

// Vue.use(BootstrapVue)
Vue.use(iView)
Vue.use(VueCarousel)
const app = remote.app
const documentDir = jetpack.cwd(app.getPath('documents'))

if (!jetpack.exists(documentDir.path('Ride Receipts'))) {
  jetpack.dir(documentDir.path('Ride Receipts'))
}

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

const store = new Store()

Vue.prototype.$electronstore = store

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  template: '<App/>'
}).$mount('#app')
