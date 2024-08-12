import request from "@/utils/request";

export const getCurrencyList = (payload) => {
  return request(`/speed/getCurrencyList`, {
    data: payload,
    method: "GET",
  });
};

export const onlineCurrency = (payload) => {
  return request(`/speed/onlineCurrency`, {
    data: payload,
    method: "POST",
  });
};

export const recommend = (payload) => {
  return request(`/speed/recommend`, {
    data: payload,
    method: "POST",
  });
};

export const getNonCurrencyList = (payload) => {
  return request(`/speed/getNonCurrencyList`, {
    data: payload,
    method: "GET",
  });
};

export const addCurrency = (payload) => {
  return request(`/speed/addCurrency`, {
    data: payload,
    method: "POST",
  });
};

export const editCurrency = (payload) => {
  return request(`/speed/editCurrency`, {
    data: payload,
    method: "POST",
  });
};

export const getSymbolList = (payload) => {
  return request(`/speed/getSymbolList`, {
    data: payload,
    method: "GET",
  });
};

export const onlineSymbol = (payload) => {
  return request(`/speed/onlineSymbol`, {
    data: payload,
    method: "POST",
  });
};

export const getAllCurrencyList = (payload) => {
  return request(`/speed/getAllCurrencyList`, {
    data: payload,
    method: "GET",
  });
};

export const getOrderList = (payload) => {
  return request(`/speed/getOrderList`, {
    data: payload,
    method: "GET",
  });
};

export const orderCompensation = (payload) => {
  return request(`/speed/orderCompensation`, {
    data: payload,
    method: "POST",
  });
};

export const orderCompensation2 = (payload) => {
  return request(`/speed/orderCompensation2`, {
    data: payload,
    method: "POST",
  });
};

// 查詢當前訂單
export const currentOrderList = (payload) => {
  return request(`/speed/current_order`, {
    data: payload,
    method: "GET",
  });
};

// 查詢历史訂單
export const historyOrderList = (payload) => {
  return request(`/speed/history_order`, {
    data: payload,
    method: "GET",
  });
};

export const getUserOrderList = (payload) => {
  return request(`/speed/getUserOrderList`, {
    data: payload,
    method: "GET",
  });
};

export const getUserOrderProxyList = (payload) => {
  return request(`/speed/getUserOrderProxyList`, {
    data: payload,
    method: "GET",
  });
};
