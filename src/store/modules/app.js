import power from "@/router/module/power-router";
import { menuData } from "@/utils/util";

const state = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  menu: JSON.parse(localStorage.getItem("menu")) ?? [],
  menuList: [],
  language: localStorage.getItem("language") ?? "zh-cn",
  routeList: localStorage.getItem("routeList")
    ? JSON.parse(localStorage.getItem("routeList"))
    : [],
  typeList: {},
  keepList: [],
  buttonList: [],
  hallInfo: null, //厅馆列表以及当前厅信息
  userOptions: [], //客户列表
  cidList: [], //币种列表
  CMOptions: [], //场面列表
  rechargeOptions: [], //充值币种列表
  deskOptions: [], //桌子列表
  peopleInfo: null, //用户信息
  isPeopleShow: false, //用户信息
  groupId: '', //跳转群消息时存储的群id
  menuPosition: 'left', //菜单位置：顶部或者左侧边
  curData:'',
  // menu: power,
};
const setMenu = (list, children = []) => {
  list.forEach((item) => {
    if (item.children) {
      item.title = item.name;
      setMenu(item.children, []);
    } else {
      if (item?.name) {
        item.title = item.name;
      } else {
        return;
      }
    }
    children.push(item);
  });
  return children;
};

const mutations = {
  setCurData(state, value) {
    state.curData = value;
  },
  changeUserinfo(state, value) {
    state.userInfo = value;
    localStorage.setItem("userInfo", JSON.stringify(value));
  },
  changeButton(state, value) {
    state.buttonList = value;
  },
  setPeoPle(state, value) {
    state.peopleInfo = value;
    state.isPeopleShow = value ? true : false;
  },
  setHallInfo(state, value) {
    state.hallInfo = value;
  },
  changePeopleList(state, value) {
    let { type, list } = value;
    state[type] = list;
  },
  changeMenu(state, value) {
    let list = setMenu(value);
    let homeObj = {
      path: "/home",
      name: "dashboard",
      component: () => import("@/views/dashboard/index.vue"),
      meta: { title: "首页", keepAlive: true },
      title: "系统首页",
    };
    state.menu = [homeObj, ...list];
    let allList = [homeObj, ...menuData(list)];
    state.menuList = allList;
    localStorage.setItem("menu", JSON.stringify(allList));
  },
  setRouteList(state, value) {
    state.routeList = value;
    localStorage.setItem("routeList", JSON.stringify(value));
  },
  setTypeList(state, list) {
    let info = {};
    list.forEach((item) => {
      info[item.type] = {};
      item.itemList.forEach((p) => {
        info[item.type][p.key] = p;
      });
    });
    state.typeList = info;
  },
  setMenuList(state, value) {
    state.menuList = value;
  },
  setGroupId(state, value) {
    state.groupId = value;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
