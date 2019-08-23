import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import enLocale from './en'
import zhLocale from './zh'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: localStorage.lang || 'zh',
  messages: {
    zh: {
      ...zhLocale
    },
    en: {
      ...enLocale
    },
  }
})

export default i18n
