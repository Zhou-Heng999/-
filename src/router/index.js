// 路由文件
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import powerRouter from "./module/power-router";
import NotFound from "../views/NotFound/index.vue";
import layout from "@/layout/index.vue";
import RouteView from "@/components/routerView/index.vue";
import store from "@/store/index";
import mixins from "@/mixins/list";
import i18n from "@/locales/index";
import { computed } from "vue";

const t = i18n.global.t;

const { dispatch, state, commit } = store;
let { getMenuList } = mixins();
let isDev = true;
if (isDev) {
  commit("app/setMenuList", powerRouter);
}
const routes = [
  {
    path: "/",
    name: "Home",
    component: layout,
    children: [
      {
        path: "/home",
        name: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "首页", keepAlive: true },
        title: "系统首页",
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
  // { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
const MAX_TABS = 15;
router.beforeEach(async (to, from, next) => {
  let menu = state.app.menu;
  let routeList = state.app.routeList;
  to.meta.keepAlive = true;
  if (to.name && !state.app.keepList.includes(to.name)) {
    state.app.keepList.push(to.name);
  }
  // 路由便签页
  if (to.meta.title) {
    let isHasRoute = routeList.some((item) => item.path == to.path);
    if (!isHasRoute) {
      if (routeList.length >= MAX_TABS) {
        ElMessage({
          showClose: true,
          message: `最大页签数不能超过${MAX_TABS}`,
          type: "warning",
        });
        return;
      }
      routeList.push({
        title: to.meta.title,
        isClick: true,
        path: to.path,
        query: to.query,
        name: to.name,
      });
      localStorage.setItem("routeList", JSON.stringify(routeList));
    }
  }

  if (to.matched.length == 0 && from.matched.length == 0) {
    await getMenuList();
  }
  if (!state.app.userInfo && to.name != "login") {
    next({ path: "/login", replace: true });
  } else {
    if (state.app.menuList.length == 0 && to.path != "/login") {
      await getMenuList();
    }
    menu = state.app.menuList.length == 0 ? powerRouter : state.app.menuList;
    if (menu.length != 0) {
      let routerName = menu[1].children[0].name;
      let hasRouter = router.hasRoute(routerName);
      if (!hasRouter) {
        menu.forEach((item) => {
          router.addRoute("Home", item);
        });
        router.options.routes[0].children = [
          ...router.options.routes[0].children,
          ...menu,
        ];
        next({ path: to.path });
      } else {
        if (to.path == "/" && from.path == "/") {
          next({ path: "/home" });
        } else {
          next();
        }
      }
    } else {
      next();
    }
    // window.scrollTo(0, 0);
  }
});

export default router;
