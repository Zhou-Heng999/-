import request from "@/utils/request";

export const getContractList = (payload) => {
  return request(`/contract/getContractList`, {
    data: payload,
    method: "GET",
  });
};

export const addContract = (payload) => {
  return request(`/contract/addContract`, {
    data: payload,
    method: "POST",
  });
};

export const editContract = (payload) => {
  return request(`/contract/editContract`, {
    data: payload,
    method: "POST",
  });
};

export const onlineContract = (payload) => {
  return request(`/contract/onlineContract`, {
    data: payload,
    method: "POST",
  });
};

export const priceSwitchContract = (payload) => {
  return request(`/contract/priceSwitchContract`, {
    data: payload,
    method: "POST",
  });
};

export const getOrderList = (payload) => {
  return request(`/contract/getOrderList`, {
    data: payload,
    method: "GET",
  });
};

// 撤单
export const cancelOrder = (payload) => {
  return request(`/contract/cancelOrder`, {
    data: payload,
    method: "POST",
  });
};
