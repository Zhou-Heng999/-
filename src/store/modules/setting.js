import { mix } from '@/utils/util'
const state = {
  // 是否开启暗黑模式
  dark: JSON.parse(localStorage.getItem('dark')) || true,
  // 默认主题色
  theme: localStorage.getItem('primaryColor') || '#0ecb81',
  themeList: [
    { name: '极光绿(默认)', value: '#0ecb81' },
    { name: '拂晓蓝', value: '#409eff' },
    { name: '薄暮红', value: '#e74c3c' },
    { name: '火山橘', value: '#e67e22' },
    { name: '日暮黄', value: '#f1c40f' },
    { name: '酱紫', value: '#9b59b6' },
  ],
  language: 'zh',
  loadingColor: 'rgba(0, 0, 0, 0.8)',
}

const mutations = {
  // 是否开启暗黑模式
  setDark(state, value) {
    state.dark = value
    localStorage.setItem('dark', value)
  },
  // 设置主题色
  setTheme(state, value) {
    state.theme = value
  },
  changeLanguage(state, value) {
    state.language = value
    localStorage.setItem('language', value)
  },
  changeTheme(state, color = state.theme) {
    const node = document.documentElement

    // 变量前缀
    const pre = '--el-color-primary'
    // 白色混合色
    const mixWhite = '#ffffff'
    // 黑色混合色
    const mixBlack = '#000000'
    state.theme = color
    node.style.setProperty(pre, color)
    node.style.setProperty('--el-menu-active-color', color)
    localStorage.setItem('primaryColor', color)
    // 这里是覆盖原有颜色的核心代码
    for (let i = 1; i < 10; i += 1) {
      node.style.setProperty(`${pre}-light-${i}`, mix(color, mixWhite, i * 0.1))
    }
    node.style.setProperty('--el-color-primary-dark', mix(color, mixBlack, 0.1))
    // 本地缓存style，样式持久化，你也可以存在后端
    localStorage.setItem('style', node.style.cssText)
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
