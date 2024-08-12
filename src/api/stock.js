import request from "@/utils/request";

export const list = (payload) => {
  return request(`/stock/list`, {
    data: payload,
    method: "GET",
  });
};

export const add = (payload) => {
  return request(`/stock/add`, {
    data: payload,
    method: "POST",
  });
};

// # 隐藏/显示
export const show = (payload) => {
  return request(`/stock/show`, {
    data: payload,
    method: "POST",
  });
};

// # 锁定/解锁
export const lock = (payload) => {
  return request(`/stock/lock`, {
    data: payload,
    method: "POST",
  });
};

//   # 编辑
export const edit = (payload) => {
  return request(`/stock/edit`, {
    data: payload,
    method: "POST",
  });
};
