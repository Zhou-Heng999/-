var Web3 = require('web3')
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import i18n from '../../i18n'
import { ElMessage } from 'element-plus'

// import { eth_balance } from '@/utils/eth'

const providerOptions = {
  /* See Provider Options Section */
  injected: {
    display: {
      description:
        i18n.locale == 'zh'
          ? '连接到您的MetaMask钱包'
          : 'Connect to your MetaMask Wallet',
    },
    package: null,
  },
  walletconnect: {
    // package: WalletConnectProvider,
    options: {
      infuraId: [
        '0aa6e496042942ff9b1869aa93a44cde',
        '78efd696cbec435a8e508497f69497b3',
        '7f041f31ea52471199ccec2d6fb3feb2',
      ],
    },
    display: {
      description:
        i18n.locale == 'zh' ? '扫描连接钱包' : 'Scan with WalletConnect',
    },
  },
}

const web3Modal = new Web3Modal({
  network: 'kovan',
  cacheProvider: true, // optional
  providerOptions, // required
})

const state = {
  account: localStorage.getItem('account') || null,
  web3: null,
  balance: 0,
  provider: null,
}
const mutations = {
  changeAccount(state, value) {
    state.account = value
  },
  setWeb3(state, value) {
    state.web3 = value
  },

  // 更改余额
  changeBalance(state, balance) {
    state.balance = Vue.options.filters['divisionDefaultPower'](
      balance,
      18,
      4,
      false
    )
  },
}
const actions = {
  async getBalance(context) {
    let { state } = context
    await state.web3.eth.getBalance(state.account).then((res) => {
      state.balance = res / 1000000000000000000
    })
  },
  async initWeb3(context) {
    if (context.state.web3) return Promise.resolve('ok')
    try {
      const provider = await web3Modal.connect()
      state.provider = provider
      await provider.enable()
      const web3 = new Web3(provider)
      state.web3 = web3
      context.commit('setWeb3', web3)
      const accounts = await web3.eth.getAccounts()
      context.commit('changeAccount', accounts[0])
      localStorage.setItem('account', accounts[0])
      // ElMessage.success('钱包已连接')
      context.dispatch('getBalance')
      provider.on('accountsChanged', (_accounts) => {
        context.commit('changeAccount', _accounts[0])

        sessionStorage.setItem('currAccount', context.state.account)
        window.location.reload()
      })
      provider.on('networkChanged', (network) => {
        window.location.reload()
      })
      context.dispatch('networkCheck')
      // return Promise.resolve(_accounts[0])

      // return this.dispatch('initContract', web3);
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async operWeb3(context) {
    if (context.state.web3 && context.state.account) {
      return Promise.resolve({
        account: context.state.account,
      })
    }
    return context.dispatch('initWeb3').then((result) => {
      return Promise.resolve({
        account: context.state.account,
      })
    })
    // return Promise.resolve("ok");
  },
  async networkCheck(context) {
    const BSC_ChainId = process.env.VUE_APP_BSC_ChainId * 1
    const ChainId = BSC_ChainId == 56 ? '0x38' : '0x61'
    const ChainName =
      BSC_ChainId == 56 ? 'Smart Chain' : 'Smart Chain - Testnet'
    const RpcUrls =
      BSC_ChainId == 56
        ? 'https://bsc-dataseed.binance.org/'
        : 'https://data-seed-prebsc-1-s3.binance.org:8545/'
    const BlockExplorerUrls =
      BSC_ChainId == 56 ? 'https://bscscan.com/' : 'https://testnet.bscscan.com'
    try {
      await context.state.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ChainId }],
      })
    } catch (switchError) {
      console.log('%c Network switch error：：', 'color: #02e502', switchError)
      if (switchError.code === 4902) {
        try {
          await context.state.provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: ChainId,
                chainName: ChainName,
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: [RpcUrls],
                blockExplorerUrls: [BlockExplorerUrls],
              },
            ],
          })
        } catch (addError) {
          console.log('%c Network add error', 'color: #02e502', addError)
        }
      }
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
