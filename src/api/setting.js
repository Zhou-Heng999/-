import request from "@/utils/request";

/**
 查询系统参数设置
 */
 export const getSystem = (payload) => {
  return request(`/setting/qry`, {
    data: payload,
    method: "GET",
  });
};

/**
 保存系统参数设置
 */
export const setSystem = (payload) => {
  return request(`/setting/update`, {
    data: payload,
    method: "POST",
  });
};

/**
 查询代理返佣费率
 */
export const getProxyInfo = (payload) => {
  return request(`/setting/getProxyInfo`, {
    data: payload,
    method: "GET",
  });
};

/**
 保存代理返佣
 */
export const saveProxyInfo = (payload) => {
  return request(`/setting/saveProxyInfo`, {
    data: payload,
    method: "POST",
  });
};

/**
 查询奖励设置
 */
export const getRewardInfo = (payload) => {
  return request(`/setting/getRewardInfo`, {
    data: payload,
    method: "GET",
  });
};

/**
 保存奖励设置
 */
export const setRewardInfo = (payload) => {
  return request(`/setting/setRewardInfo`, {
    data: payload,
    method: "POST",
  });
};

/**
 查询兑换比例
 */
export const getExchangeInfo = (payload) => {
  return request(`/setting/getExchangeInfo`, {
    data: payload,
    method: "GET",
  });
};

/**
 保存兑换比例
 */
export const setExchangeInfo = (payload) => {
  return request(`/setting/setExchangeInfo`, {
    data: payload,
    method: "POST",
  });
};

/**
 保存FAQ
 */
export const setFAQ = (payload) => {
  return request(`/setting/setFAQ`, {
    data: payload,
    method: "POST",
  });
};

/**
 getFAQ
 */
export const getFAQ = (payload) => {
  return request(`/setting/getFAQ`, {
    data: payload,
    method: "GET",
  });
};
