import request from "@/utils/request";

export const getSubordinateList = (payload) => {
  return request(`/proxy/getSubordinateList`, {
    data: payload,
    method: "GET",
  });
};

export const addSubordinate = (payload) => {
  return request(`/proxy/addSubordinate`, {
    data: payload,
    method: "POST",
  });
};

export const getSubordinateProxyList = (payload) => {
  return request(`/proxy/getSubordinateProxyList`, {
    data: payload,
    method: "GET",
  });
};

export const proxyMoreList = (payload) => {
  return request(`/proxy/getProxyMoreList`, {
    data: payload,
    method: "GET",
  });
};

// 查询返佣信息
export const proxy2List = (payload) => {
  return request(`/proxy/getProxy2List`, {
    data: payload,
    method: "GET",
  });
};
export const proxy3List = (payload) => {
  return request(`/proxy/getProxy3List`, {
    data: payload,
    method: "GET",
  });
};

export const proxy1List = (payload) => {
  return request(`/proxy/getProxy1List`, {
    data: payload,
    method: "GET",
  });
};

export const getNetworkInfo = (payload) => {
  return request(`/proxy/getNetworkInfo`, {
    data: payload,
    method: "GET",
  });
};

export const getUserInviteList = (payload) => {
  return request(`/proxy/getUserInviteList`, {
    data: payload,
    method: "GET",
  });
};
