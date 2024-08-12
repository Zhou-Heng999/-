import { mix } from '@/utils/util'
const state = {
  adList: [],
}

const mutations = {
  changeList(state, value) {
    state.adList = value
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
