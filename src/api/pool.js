import request from "@/utils/request";

/**
 查询矿机列表
 */
export const getProductList = (payload) => {
  return request(`/pool/getProductList`, {
    data: payload,
    method: "GET",
  });
};

// 上下线矿机
export const onlineProduct = (payload) => {
  return request(`/pool/onlineProduct`, {
    data: payload,
    method: "POST",
  });
};

// 上下线矿机
export const addProduct = (payload) => {
  return request(`/pool/addProduct`, {
    data: payload,
    method: "POST",
  });
};

export const editProduct = (payload) => {
  return request(`/pool/editProduct`, {
    data: payload,
    method: "POST",
  });
};

export const getOrderList = (payload) => {
  return request(`/pool/getOrderList`, {
    data: payload,
    method: "GET",
  });
};
