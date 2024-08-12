import request from "@/utils/request";

/**
 添加账户
 */
export const userAdd = (payload) => {
  return request(`/user/add`, {
    data: payload,
    method: "POST",
  });
};

/**
 修改账户
 */
export const userUpdate = (payload) => {
  return request(`/user/update`, {
    data: payload,
    method: "POST",
  });
};

/**
 添加账户
 */
export const userDelete = (payload) => {
  return request(`/user/del`, {
    data: payload,
    method: "POST",
  });
};

/**
 清除google验证码
 */
export const clearKey = (payload) => {
  return request(`/user/clear_secret_key`, {
    data: payload,
    method: "POST",
  });
};

/**
 修改密码
 */
export const changePassword = (payload) => {
  return request(`/user/change_password`, {
    data: payload,
    method: "POST",
  }, "application/json");
};

/**
 修改密码
 */
export const resetPassword = (payload) => {
  return request(`/user/reset_password`, {
    data: payload,
    method: "POST",
  });
};

/**
 登录状态检测
 */
export const loginCheck = (payload) => {
  return request(`/user/login_state_check`, {
    data: payload,
    method: "GET",
  });
};

/**
 查询账户列表
 */
export const userQry = (payload) => {
  return request(`/user/qry`, {
    data: payload,
    method: "GET",
  });
};

/**
 查询黑名单列表
 */
export const getBlack = (payload) => {
  return request(`/user/blackList`, {
    data: payload,
    method: "GET",
  });
};

/**
 删除黑名单
 */
export const delBlack = (payload) => {
  return request(`/user/delBlack`, {
    data: payload,
    method: "POST",
  });
};

/**
 查询添加/修改 黑名单
 */
export const editBlack = (payload) => {
  return request(`/user/editBlack`, {
    data: payload,
    method: "POST",
  });
};
