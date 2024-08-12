/*
 * @Descripttion: 
 * @Date: 2022-04-29 15:52:47
 */
const state = {
  adress_name:''
}

const mutations = {
  getadress(state, value) {
    state.adress_name = value
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}