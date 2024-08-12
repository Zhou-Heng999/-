import request from "@/utils/request";

// 添加借贷币种
export const addSymbol = (payload) => {
  return request(`/pledge/addSymbol`, {
    data: payload,
    method: "POST",
  });
};

// 添加编辑币种
export const editSymbol = (payload) => {
  return request(`/pledge/editSymbol`, {
    data: payload,
    method: "POST",
  });
};

// 查看借贷币种列表
export const getSymbolList = (payload) => {
  return request(`/pledge/getSymbolList`, {
    data: payload,
    method: "GET",
  });
};

// 币种 上线/下线
export const symbolOnline = (payload) => {
  return request(`/pledge/symbolOnline`, {
    data: payload,
    method: "POST",
  });
};

//
export const getOrderList = (payload) => {
  return request(`/pledge/getOrderList`, {
    data: payload,
    method: "GET",
  });
};
