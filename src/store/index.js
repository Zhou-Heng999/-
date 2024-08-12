/*
 * @Descripttion:
 * @Date: 2022-04-29 10:29:39
 */
import { createStore, createLogger } from "vuex";
import getters from "./getters.js";
// import web3 from './modules/web3.js'
import setting from "./modules/setting.js";
import app from "./modules/app.js";
import ad from "./modules/ad.js";
import tab from "./modules/tab.js";

import lockcoin from "./modules/lockcoin.js";

const debug = false;

export default createStore({
  modules: {
    app,
    setting,
    ad,
    lockcoin,
    tab,
  },
  getters,
  // strict: debug,
  // plugins: debug ? [createLogger()] : [],
});
