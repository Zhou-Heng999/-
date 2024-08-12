const getters = {
  // 是否开启暗黑模式
  getDark: (state) => state.setting.dark,
  getAccount: (state) => state.web3.account,
  getChain: (state) => state.app.chain,
  getSwap: (state) => state.app.swap,
  getPairInfo: (state) => state.app.pairInfo,
  getChainInfo: (state) => state.app.chainList,
  getHotList: (state) => state.app.hotList,
  getTheme: (state) => state.setting.theme,
}
export default getters
