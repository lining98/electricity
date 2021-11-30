import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入axios
import axios from 'axios'
import VueAxios from 'vue-axios'

// 引入element-ui
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import http from './http'
Vue.prototype.$http = http


Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(elementUI)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
