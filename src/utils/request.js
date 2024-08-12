import axios from "axios";
// import { ElNotification } from "element-plus";
import { PAIR } from "@/store/mutation-types";
import qs from "qs";
import store from "@/store/index.js";
import router from "@/router/index.js";

// 弹窗次数
let requestOptions = null;
const codeMessage = {
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

// 处理接口（系统）和网络异常
const errorHandler = (error) => {
  console.log("error", error);
  if (error && error.response) {
    const { response } = error;
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, config } = response;
    ElNotification({
      type: "error",
      title: `请求错误 ${status}: ${config.url}`,
      message: `${errorText}`,
    });
  } else {
    ElNotification({
      type: "error",
      title: "请检查一下网络情况",
      duration: 4,
    });
  }
};

// 请求拦截器
axios.interceptors.request.use(
  function (config) {
    requestOptions = config;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  function (res) {
    let { result } = res.data;
    if (result) {
      return Promise.resolve(res.data);
    } else {
      if (res.data.msg) {
        if (res.data.code == 2001) {
          router.push("/login");
          return
        }
        ElMessage({
          showClose: true,
          message: `${res.data.msg}`,
          type: "warning",
        });
      }

      return Promise.reject(res.data);
    }
  },
  (error) => {
    console.log(error);
    if (axios.isCancel(error)) {
      console.log("主动取消请求");
      return new Promise(() => {});
    }
    if (requestOptions.useErrorTips) {
      errorHandler(error);
    }
    return Promise.reject(error);
  }
);

export default function (url, params = {}, contenType = "application/x-www-form-urlencoded") {
  let { VITE_APP_BASE_URL, VITE_NODE_ENV } = import.meta.env;
  if (params.method == "GET" && params.data) {
    url = `${url}?${qs.stringify(params.data)}`;
  }
  // url = `${url}?${getParam}`
  const defaultConfig = {
    url: VITE_NODE_ENV == "development" ? `/api${url}` : url,
    method: "POST",
    timeout: 1000 * 20,
    headers: {
      // "Content-Type": "application/x-www-form-urlencoded",
      "Content-Type": contenType,
      "token" : localStorage.getItem("token")
    },
    baseURL: VITE_NODE_ENV == "development" ? "" : VITE_APP_BASE_URL,
    withCredentials: true, // 允许cookie跨域
    useToken: true, // 是否需要token
    useErrorTips: false, // 默认系统提示
  };
  const newConfig = { ...defaultConfig, ...params };

  if (url != "/uploadImg") {
    if (contenType == "application/x-www-form-urlencoded"){
      newConfig.data = qs.stringify(newConfig.data);
    }
  }
  // token 开关
  if (newConfig.useToken) {
    newConfig.headers = {
      ...newConfig.headers,
    };
  }
  return axios(newConfig);
}
