import RouteView from "@/components/routerView/index.vue";

// const power = [
//   {
//     path: "/system",
//     name: "system",
//     meta: {
//       title: "系统管理",
//       keepAlive: false,
//       icon: "iconfont icon-xitong-",
//     },
//     component: RouteView,
//     children: [
//       {
//         path: "/system/user",
//         name: "systemUser",
//         component: () => import("@/views/system/user/index.vue"),
//         meta: {
//           title: "用户管理",
//           key: "get_user",
//           keepAlive: false,
//           icon: "iconfont icon-jurassic_add-user",
//         },
//       },
//       {
//         path: "/system/role",
//         name: "systemRole",
//         component: () => import("@/views/system/role/index.vue"),
//         meta: {
//           title: "角色管理",
//           key: "get_role",
//           keepAlive: false,
//           icon: "iconfont icon-jurassic_add-user",
//         },
//       },
//     ],
//   },
//   {
//     path: "/pub",
//     name: "pub",
//     meta: {
//       title: "广告管理",
//       keepAlive: false,
//       icon: "iconfont icon-dingdan",
//     },
//     component: RouteView,
//     children: [
//       {
//         path: "/pub/getAd",
//         name: "getAd",
//         component: () => import("@/views/pub/ad/index.vue"),
//         meta: {
//           title: "广告管理",
//           key: "get_ad",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       {
//         path: "/pub/getNotice",
//         name: "getNotice",
//         component: () => import("@/views/pub/notice/index.vue"),
//         meta: {
//           title: "公告管理",
//           key: "get_notice",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       {
//         path: "/pub/getPopupInfo",
//         name: "getPopupInfo",
//         component: () => import("@/views/pub/popup/index.vue"),
//         meta: {
//           title: "弹窗管理",
//           key: "get_popup",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//     ],
//   },
//   {
//     path: "/currency",
//     name: "currency",
//     meta: {
//       title: "币币管理",
//       keepAlive: false,
//       icon: "iconfont icon-dingdan",
//     },
//     component: RouteView,
//     children: [
//       {
//         path: "/currency/getCurrency",
//         name: "getCurrency",
//         component: () => import("@/views/currency/currency/index.vue"),
//         meta: {
//           title: "币种管理",
//           key: "get_currency",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       {
//         path: "/currency/getSymbol",
//         name: "getSymbol",
//         component: () => import("@/views/currency/symbol/index.vue"),
//         meta: {
//           title: "币种类型",
//           key: "get_symbol",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       {
//         path: "/currency/getOrderList",
//         name: "getOrderList",
//         component: () => import("@/views/currency/order/index.vue"),
//         meta: {
//           title: "订单列表",
//           key: "get_orderList",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//     ],
//   },
//   {
//     path: "/contract",
//     name: "contract",
//     meta: {
//       title: "合约管理",
//       keepAlive: false,
//       icon: "iconfont icon-dingdan",
//     },
//     component: RouteView,
//     children: [
//       {
//         path: "/contract/getContractList",
//         name: "getContractList",
//         component: () => import("@/views/contract/currency/index.vue"),
//         meta: {
//           title: "币种管理",
//           key: "get_contract",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       // {
//       //   path: "/contract/getSymbolList",
//       //   name: "getSymbolList",
//       //   component: () => import("@/views/contract/symbol/index.vue"),
//       //   meta: {
//       //     title: "币种类型",
//       //     key: "get_symbolList",
//       //     keepAlive: false,
//       //     icon: "iconfont icon-dingdandingdanchaxun",
//       //   },
//       // },
//       {
//         path: "/contract/getOrder",
//         name: "getOrder",
//         component: () => import("@/views/contract/order/index.vue"),
//         meta: {
//           title: "开仓订单",
//           key: "get_order",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//     ],
//   },
//   {
//     path: "/speed",
//     name: "speed",
//     meta: {
//       title: "极速合约",
//       keepAlive: false,
//       icon: "iconfont icon-dingdan",
//     },
//     component: RouteView,
//     children: [
//       {
//         path: "/speed/getCurrency",
//         name: "getSpeedCurrency",
//         component: () => import("@/views/speed/currency/index.vue"),
//         meta: {
//           title: "币种管理",
//           key: "get_speed",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       // {
//       //   path: "/speed/getSymbol",
//       //   name: "getSpeedSymbol",
//       //   component: () => import("@/views/speed/symbol/index.vue"),
//       //   meta: {
//       //     title: "币种类型",
//       //     key: "get_symbol",
//       //     keepAlive: false,
//       //     icon: "iconfont icon-dingdandingdanchaxun",
//       //   },
//       // },
//       {
//         path: "/speed/getOrderList",
//         name: "getSpeedOrderList",
//         component: () => import("@/views/speed/order/index.vue"),
//         meta: {
//           title: "订单列表",
//           key: "get_orderList",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//     ],
//   },
//   {
//     path: "/user",
//     name: "user",
//     meta: {
//       title: "用户管理",
//       keepAlive: false,
//       icon: "iconfont icon-xitong-",
//     },
//     component: RouteView,
//     children: [
//       {
//         path: "/user/userList",
//         name: "userList",
//         component: () => import("@/views/user/user/index.vue"),
//         meta: {
//           title: "用户管理",
//           key: "userList",
//           keepAlive: false,
//           icon: "iconfont icon-jurassic_add-user",
//         },
//       },
//       {
//         path: "/user/register",
//         name: "register",
//         component: () => import("@/views/user/register/index.vue"),
//         meta: {
//           title: "注册用户",
//           key: "registerList",
//           keepAlive: false,
//           icon: "iconfont icon-jurassic_add-user",
//         },
//       },
//       {
//         path: "/user/subordinateList",
//         name: "subordinateList",
//         component: () => import("@/views/user/subordinate/index.vue"),
//         meta: {
//           title: "下属管理",
//           key: "subordinate",
//           keepAlive: false,
//           icon: "iconfont icon-jurassic_add-user",
//         },
//       },
//       {
//         path: "/user/network",
//         name: "network",
//         component: () => import("@/views/user/network/index.vue"),
//         meta: {
//           title: "关系网查询",
//           key: "network",
//           keepAlive: false,
//           icon: "iconfont icon-jurassic_add-user",
//         },
//       },
//       {
//         path: "/user/balanceList",
//         name: "balanceList",
//         component: () => import("@/views/user/balance/index.vue"),
//         meta: {
//           title: "余额查询",
//           key: "balanceList",
//           keepAlive: false,
//           icon: "iconfont icon-jurassic_add-user",
//         },
//       },
//       {
//         path: "/user/whiteList",
//         name: "whiteList",
//         component: () => import("@/views/user/white/index.vue"),
//         meta: {
//           title: "手机白名单",
//           key: "whiteList",
//           keepAlive: false,
//           icon: "iconfont icon-jurassic_add-user",
//         },
//       },
//       {
//         path: "/user/capitalList",
//         name: "capitalList",
//         component: () => import("@/views/user/capital/index.vue"),
//         meta: {
//           title: "资金明细",
//           key: "capitalList",
//           keepAlive: false,
//           icon: "iconfont icon-jurassic_add-user",
//         },
//       },
//     ],
//   },
//   {
//     path: "/setting",
//     name: "setting",
//     meta: {
//       title: "系统设置",
//       keepAlive: false,
//       icon: "iconfont icon-dingdan",
//     },
//     component: RouteView,
//     children: [
//       {
//         path: "/setting/proxyInfo",
//         name: "proxyInfo",
//         component: () => import("@/views/setting/proxyInfo/index.vue"),
//         meta: {
//           title: "代理返佣",
//           key: "proxyInfo",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       {
//         path: "/setting/rewardInfo",
//         name: "rewardInfo",
//         component: () => import("@/views/setting/rewardInfo/index.vue"),
//         meta: {
//           title: "奖励设置",
//           key: "rewardInfo",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       {
//         path: "/setting/exchangeInfo",
//         name: "exchangeInfo",
//         component: () => import("@/views/setting/exchangeInfo/index.vue"),
//         meta: {
//           title: "兑换设置",
//           key: "exchangeInfo",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       // {
//       //   path: "/setting/leaderList",
//       //   name: "leaderList",
//       //   component: () => import("@/views/setting/leader/index.vue"),
//       //   meta: {
//       //     title: "经纪人设置",
//       //     key: "leaderList",
//       //     keepAlive: false,
//       //     icon: "iconfont icon-dingdandingdanchaxun",
//       //   },
//       // },
//       // {
//       //   path: "/setting/roomList",
//       //   name: "roomList",
//       //   component: () => import("@/views/setting/room/index.vue"),
//       //   meta: {
//       //     title: "聊天室设置",
//       //     key: "roomList",
//       //     keepAlive: false,
//       //     icon: "iconfont icon-dingdandingdanchaxun",
//       //   },
//       // },
//       {
//         path: "/setting/versionInfo",
//         name: "versionInfo",
//         component: () => import("@/views/setting/versionInfo/index.vue"),
//         meta: {
//           title: "下载设置",
//           key: "versionInfo",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       {
//         path: "/setting/FAQ",
//         name: "FAQ",
//         component: () => import("@/views/setting/FAQ/index.vue"),
//         meta: {
//             title: "常见问题",
//             key: "FAQ",
//             keepAlive: false,
//             icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//     ],
//   },
//   {
//     path: "/trans",
//     name: "trans",
//     meta: {
//       title: "充提管理",
//       keepAlive: false,
//       icon: "iconfont icon-dingdan",
//     },
//     component: RouteView,
//     children: [
//       {
//         path: "/trans/rechargeList",
//         name: "rechargeList",
//         component: () => import("@/views/trans/recharge/index.vue"),
//         meta: {
//           title: "充值记录",
//           key: "recharge",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       {
//         path: "/trans/withdrawList",
//         name: "withdrawList",
//         component: () => import("@/views/trans/withdraw/index.vue"),
//         meta: {
//           title: "提现记录",
//           key: "withdraw",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       {
//         path: "/trans/transType",
//         name: "transType",
//         component: () => import("@/views/trans/transType/index.vue"),
//         meta: {
//           title: "充提设置",
//           key: "transType",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       {
//         path: "/trans/transSta",
//         name: "transSta",
//         component: () => import("@/views/trans/transSta/index.vue"),
//         meta: {
//           title: "充提查询",
//           key: "transSta",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       // {
//       //   path: "/trans/transferInfo",
//       //   name: "transferInfo",
//       //   component: () => import("@/views/trans/transferInfo/index.vue"),
//       //   meta: {
//       //     title: "划转设置",
//       //     key: "transferInfo",
//       //     keepAlive: false,
//       //     icon: "iconfont icon-dingdandingdanchaxun",
//       //   },
//       // },
//       // {
//       //   path: "/trans/transferList",
//       //   name: "transferList",
//       //   component: () => import("@/views/trans/transferList/index.vue"),
//       //   meta: {
//       //     title: "划账记录",
//       //     key: "transferList",
//       //     keepAlive: false,
//       //     icon: "iconfont icon-dingdandingdanchaxun",
//       //   },
//       // },
//       {
//         path: "/trans/sellUserList",
//         name: "sellUserList",
//         component: () => import("@/views/trans/sellUserList/index.vue"),
//         meta: {
//           title: "充值商户",
//           key: "sellUserList",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       {
//         path: "/trans/buyUserList",
//         name: "buyUserList",
//         component: () => import("@/views/trans/buyUserList/index.vue"),
//         meta: {
//           title: "提现商户",
//           key: "buyUserList",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//     ],
//   },
//   // {
//   //   path: "/mining",
//   //   name: "mining",
//   //   meta: {
//   //     title: "矿机管理",
//   //     keepAlive: false,
//   //     icon: "iconfont icon-dingdan",
//   //   },
//   //   component: RouteView,
//   //   children: [
//   //     {
//   //       path: "/mining/productList",
//   //       name: "productList",
//   //       component: () => import("@/views/mining/productList/index.vue"),
//   //       meta: {
//   //         title: "矿机管理",
//   //         key: "productList",
//   //         keepAlive: false,
//   //         icon: "iconfont icon-dingdandingdanchaxun",
//   //       },
//   //     },
//   //     {
//   //       path: "/mining/productSet",
//   //       name: "productSet",
//   //       component: () => import("@/views/mining/productSet/index.vue"),
//   //       meta: {
//   //         title: "矿机设置",
//   //         key: "productSet",
//   //         keepAlive: false,
//   //         icon: "iconfont icon-dingdandingdanchaxun",
//   //       },
//   //     },
//   //     {
//   //       path: "/mining/orderList",
//   //       name: "orderList",
//   //       component: () => import("@/views/mining/orderList/index.vue"),
//   //       meta: {
//   //         title: "订单列表",
//   //         key: "orderList",
//   //         keepAlive: false,
//   //         icon: "iconfont icon-dingdandingdanchaxun",
//   //       },
//   //     },
//   //   ],
//   // },
//   {
//     path: "/pool",
//     name: "pool",
//     meta: {
//       title: "锁币挖矿",
//       keepAlive: false,
//       icon: "iconfont icon-dingdan",
//     },
//     component: RouteView,
//     children: [
//       {
//         path: "/pool/productList",
//         name: "poolProductList",
//         component: () => import("@/views/pool/productList/index.vue"),
//         meta: {
//           title: "矿池管理",
//           key: "productList",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       {
//         path: "/pool/orderList",
//         name: "poolOrderList",
//         component: () => import("@/views/pool/orderList/index.vue"),
//         meta: {
//           title: "订单列表",
//           key: "orderList",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//     ],
//   },
//   // {
//   //   path: "/wallet",
//   //   name: "wallet",
//   //   meta: {
//   //     title: "钱包管理",
//   //     keepAlive: false,
//   //     icon: "iconfont icon-dingdan",
//   //   },
//   //   component: RouteView,
//   //   children: [
//   //     {
//   //       path: "/wallet/walletSet",
//   //       name: "walletSet",
//   //       component: () => import("@/views/wallet/walletSet/index.vue"),
//   //       meta: {
//   //         title: "钱包设置",
//   //         key: "walletSet",
//   //         keepAlive: false,
//   //         icon: "iconfont icon-dingdandingdanchaxun",
//   //       },
//   //     },
//   //     {
//   //       path: "/wallet/walletRecordList",
//   //       name: "walletRecordList",
//   //       component: () => import("@/views/wallet/walletRecordList/index.vue"),
//   //       meta: {
//   //         title: "钱包明细",
//   //         key: "walletRecordList",
//   //         keepAlive: false,
//   //         icon: "iconfont icon-dingdandingdanchaxun",
//   //       },
//   //     },
//   //   ],
//   // },
//   {
//     path: "/loan",
//     name: "loan",
//     meta: {
//       title: "借贷管理",
//       keepAlive: false,
//       icon: "iconfont icon-dingdan",
//     },
//     component: RouteView,
//     children: [
//       {
//         path: "/loan/info",
//         name: "loanInfo",
//         component: () => import("@/views/loan/info/index.vue"),
//         meta: {
//           title: "借贷配置",
//           key: "loanInfo",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//       {
//         path: "/loan/orderList",
//         name: "loanOrderList",
//         component: () => import("@/views/loan/orderList/index.vue"),
//         meta: {
//           title: "订单列表",
//           key: "loanOrderList",
//           keepAlive: false,
//           icon: "iconfont icon-dingdandingdanchaxun",
//         },
//       },
//     ],
//   },
// ];
const power = [];
export default power;
