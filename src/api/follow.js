import request from "@/utils/request";

//# 新增币种
export const addCurrency = (payload) => {
  return request(`/follow/addCurrency`, {
    data: payload,
    method: "POST",
  });
};

//# 编辑币种
export const editCurrency = (payload) => {
  return request(`/follow/editCurrency`, {
    data: payload,
    method: "POST",
  });
};
//# 列表数据
export const getCurrencyList = (payload) => {
  return request(`/follow/getCurrencyList`, {
    data: payload,
    method: "GET",
  });
};

//# 是否推荐
export const recommend = (payload) => {
  return request(`/follow/recommend`, {
    data: payload,
    method: "POST",
  });
};

//# 上下线
export const onlineCurrency = (payload) => {
  return request(`/follow/onlineCurrency`, {
    data: payload,
    method: "POST",
  });
};

// getOrderList

export const getOrderList = (payload) => {
  return request(`/follow/getOrderList`, {
    data: payload,
    method: "GET",
  });
};
