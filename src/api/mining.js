import request from "@/utils/request";

/**
 查询矿机列表
 */
export const getProductList = (payload) => {
  return request(`/mining/getProductList`, {
    data: payload,
    method: "GET",
  });
};

// 上下线矿机
export const onlineProduct = (payload) => {
  return request(`/mining/onlineProduct`, {
    data: payload,
    method: "POST",
  });
};

// 上下线矿机
export const addProduct = (payload) => {
  return request(`/mining/addProduct`, {
    data: payload,
    method: "POST",
  });
};

export const editProduct = (payload) => {
  return request(`/mining/editProduct`, {
    data: payload,
    method: "POST",
  });
};

export const getProductSet = (payload) => {
  return request(`/mining/getProductSet`, {
    data: payload,
    method: "GET",
  });
};

export const editProductSet = (payload) => {
  return request(`/mining/editProductSet`, {
    data: payload,
    method: "POST",
  });
};

export const getOrderSta = (payload) => {
  return request(`/mining/getOrderSta`, {
    data: payload,
    method: "GET",
  });
};

export const getOrderList = (payload) => {
  return request(`/mining/getOrderList`, {
    data: payload,
    method: "GET",
  });
};
