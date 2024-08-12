import request from "@/utils/request";

export const getCurrencyList = (payload) => {
  return request(`/currency/getCurrencyList`, {
    data: payload,
    method: "GET",
  });
};

export const onlineCurrency = (payload) => {
  return request(`/currency/onlineCurrency`, {
    data: payload,
    method: "POST",
  });
};

export const recommend = (payload) => {
  return request(`/currency/recommend`, {
    data: payload,
    method: "POST",
  });
};

export const getNonCurrencyList = (payload) => {
  return request(`/currency/getNonCurrencyList`, {
    data: payload,
    method: "GET",
  });
};

export const addCurrency = (payload) => {
  return request(`/currency/addCurrency`, {
    data: payload,
    method: "POST",
  });
};

export const editCurrency = (payload) => {
  return request(`/currency/editCurrency`, {
    data: payload,
    method: "POST",
  });
};

export const getSymbolList = (payload) => {
  return request(`/currency/getSymbolList`, {
    data: payload,
    method: "GET",
  });
};

export const onlineSymbol = (payload) => {
  return request(`/currency/onlineSymbol`, {
    data: payload,
    method: "POST",
  });
};

export const getAllCurrencyList = (payload) => {
  return request(`/currency/getAllCurrencyList`, {
    data: payload,
    method: "GET",
  });
};

export const getOrderList = (payload) => {
  return request(`/currency/getOrderList`, {
    data: payload,
    method: "GET",
  });
};

export const orderCompensation = (payload) => {
  return request(`/currency/orderCompensation`, {
    data: payload,
    method: "POST",
  });
};

export const orderCompensation2 = (payload) => {
  return request(`/currency/orderCompensation2`, {
    data: payload,
    method: "POST",
  });
};

// 查詢當前訂單
export const currentOrderList = (payload) => {
  return request(`/currency/current_order`, {
    data: payload,
    method: "GET",
  });
};

// 查詢历史訂單
export const historyOrderList = (payload) => {
  return request(`/currency/history_order`, {
    data: payload,
    method: "GET",
  });
};

export const getUserOrderList = (payload) => {
  return request(`/currency/getUserOrderList`, {
    data: payload,
    method: "GET",
  });
};

export const getUserOrderProxyList = (payload) => {
  return request(`/currency/getUserOrderProxyList`, {
    data: payload,
    method: "GET",
  });
};

//币种列表
export const getQry = (payload) => {
  return request(`/currency/qry`, {
    data: payload,
    method: "GET",
  });
};
//币种添加
export const add = (payload) => {
  return request(`/currency/add`, {
    data: payload,
    method: "POST",
  });
};
//币种编辑
export const edit = (payload) => {
  return request(`/currency/edit`, {
    data: payload,
    method: "POST",
  });
};
//币种删除
export const del = (payload) => {
  return request(`/currency/del`, {
    data: payload,
    method: "POST",
  });
};
