import { createI18n } from 'vue-i18n'
import en from './locales/en.js'
import zh from './locales/zh.js'

// 定义语言包
const messages = {
  en,
  zh
}

// 获取浏览器语言
const getBrowserLocale = () => {
  const locale = navigator.language ? navigator.language.split('-')[0] : 'en' // 获取语言代码，例如'en'或'zh'
  return ['en', 'zh'].includes(locale) ? locale : 'en'
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用Composition API模式
  locale: localStorage.getItem('locale') || getBrowserLocale() || 'en', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages // 语言包
})

export default i18n