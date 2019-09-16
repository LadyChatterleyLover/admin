import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './mock'
import ElementUI, {Message} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import http from './http'
import moment from 'dayjs'
import lodash from 'lodash'
import LunarFullCalendar from 'vue-lunar-full-calendar'
import Print from 'vue-print-nb'
// i18n国际化
import i18n from "./i18n/i18n"
import VCharts from 'v-charts'
import VueClipboard from 'vue-clipboard2'





Vue.use(VueClipboard)
Vue.use(VCharts)
Vue.use(LunarFullCalendar)
Vue.use(ElementUI)
Vue.use(Print)
Vue.prototype.$com = http
Vue.prototype.$moment = moment
Vue.prototype.$lodash = lodash
Vue.config.productionTip = false


axios.defaults.timeout = 10000
// axios.interceptors.request.use(config => {
//   let token = 'Bearer ' + localStorage.getItem('adminToken')
//   if (token) {
//     config.headers.Authorization = token
//   }
//   return config
// })


axios.interceptors.response.use(
    response => {
      return response.data
    }, error => {
      return Promise.reject(error)
    })

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
