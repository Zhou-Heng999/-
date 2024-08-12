import { computed, onMounted, ref } from 'vue'
import store from '@/store/index'
import { useCssVar } from '@vueuse/core'
const { state, commit } = store

function theme() {
  // 当前默认主题色
  const themeValue = computed(() => state.setting.theme)
  const primaryList = [
    '--el-color-primary',
    '--el-menu-active-color',
    '--el-button-bg-color',
  ]
  // 切换主题色
  const setTheme = (value) => {
    // commit('setting/setTheme', value)
    // const el = document.documentElement
    // primaryList.forEach((item, index) => {
    //   index = useCssVar(item, el)
    //   el.style[item] = value
    //   index.value = value
    // })
    // const primary_color = useCssVar('--el-color-primary', el)
    // useCssVar('--el-menu-active-color', el)
    // primary_color.value = themeValue.value
  }
  onMounted(() => {
    setTheme(themeValue.value)
  })
  return {
    setTheme,
  }
}

export default theme
