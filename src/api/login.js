import request from "@/utils/request";

/**
 登录
 */
export const loginIn = (payload) => {
  return request(`/login`, {
    data: payload,
    method: "POST",
  });
};

/**
 登出
 */
export const loginOut = (payload) => {
  return request(`/logout`, {
    data: payload,
    method: "POST",
  });
};

/**
 查询菜单
 */
export const menu = (payload) => {
  return request(`/system/menu`, {
    data: payload,
    method: "GET",
  });
};
