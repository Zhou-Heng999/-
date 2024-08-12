import request from "@/utils/request";

export const typelist = (payload) => {
  return request(`/items/typelist`, {
    data: payload,
    method: "GET",
  });
};

export const validItemsList = (payload) => {
  return request(`/items/validItemsList`, {
    data: payload,
    method: "GET",
  });
};

export const jdlist = (payload) => {
  return request(`/items/jdlist`, {
    data: payload,
    method: "GET",
  });
};

export const list = (payload) => {
  return request(`/items/list`, {
    data: payload,
    method: "GET",
  });
};

export const itemTypeAdd = (payload) => {
  return request(`/items/itemTypeAdd`, {
    data: payload,
    method: "POST",
  });
};

export const itemsAdd = (payload) => {
  return request(`/items/itemsAdd`, {
    data: payload,
    method: "POST",
  });
};

export const itemsUpdate = (payload) => {
  return request(`/items/itemsUpdate`, {
    data: payload,
    method: "POST",
  });
};

export const upgradeOnline = (payload) => {
  return request(`/items/upgradeOnline`, {
    data: payload,
    method: "POST",
  });
};

export const shopOnline = (payload) => {
  return request(`/items/shopOnline`, {
    data: payload,
    method: "POST",
  });
};

export const itemsOnline = (payload) => {
  return request(`/items/itemsOnline`, {
    data: payload,
    method: "POST",
  });
};

export const DIYOnline = (payload) => {
  return request(`/items/DIYOnline`, {
    data: payload,
    method: "POST",
  });
};
// 兑换订单记录

export const order_list = (payload) => {
  return request(`/items/order_list`, {
    data: payload,
    method: "GET",
  });
};

// 编辑订单

export const order_edit = (payload) => {
  return request(`/items/order_edit`, {
    data: payload,
    method: "POST",
  });
};
