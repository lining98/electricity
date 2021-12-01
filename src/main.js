import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入axios
import axios from 'axios'
import VueAxios from 'vue-axios'

// 引入element-ui
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor)
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(elementUI)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
