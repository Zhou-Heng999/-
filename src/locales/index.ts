import { createI18n } from 'vue-i18n'
// element-plus 中的语言配置
import elementEnLocale from 'element-plus/lib/locale/lang/en'
import elementZhLocale from 'element-plus/lib/locale/lang/zh-cn'
import elementTwLocale from 'element-plus/lib/locale/lang/zh-tw'
import lan from './lan.json'
// 自己的语言配置
import enLocale from './en'
import zhLocale from './zh-cn'
import twLocale from './zh-tw'

let Language = lan.Language
let zh = {},
  en = {},
  zh_tw={}
for (let i in Language) {
  zh_tw[i] = Language[i]['zh_tw']
  en[i] = Language[i]['en']
  zh[i] = Language[i]['zh']
}
// 语言配置整合
const messages = {
    'en':{
        ...enLocale,
        ...elementEnLocale,
        ...en

    },
    'zh-cn':{
        ...zhLocale,
        ...elementZhLocale,
        ...zh
    },
    'zh-tw':{
        ...twLocale,
        ...elementTwLocale,
        ...zh_tw

    },
}
console.log('messages',messages)

// 创建 i18n
const i18n = createI18n({
    legacy: false,
    globalInjection:true,  // 全局模式，可以直接使用 $t
    locale: localStorage.getItem('language') || 'zh-cn',
    messages: messages,
    missingWarn:false,
    silentTranslationWarn: true
})

export default i18n