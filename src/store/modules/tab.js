import { mix } from "@/utils/util";
const state = {
  tabsOption: [
    {
      route: "/home",
      title: {
        "/zh-CN": "首页",
        "/en-US": "Home Page",
      },
      name: "home",
    },
  ],
};

const mutations = {
  ADD_TAB: (state, data) => {
    state.tabsOption.push(data);
  },
  DELETE_TAB: (state, route) => {
    const index = state.tabsOption.findIndex((tab) => tab.route === route);
    state.tabsOption.splice(index, 1);
  },
  SET_TAB: (state, index) => {
    state.currentIndex = index;
  },
  CLEAR_TAB: (state) => {
    // 初始化tab
    state.tabsOption = [
      {
        route: "/home",
        title: {
          "/zh-CN": "首页",
          "/en-US": "Home Page",
        },
        name: "home",
      },
    ];
  },
};

const actions = {};
const getters = {
  getCurrentIndex(state) {
    return state.currentIndex;
  },
  getTabsOption(state) {
    return state.tabsOption;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
