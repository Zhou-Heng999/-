import request from "@/utils/request";

export const typelist = (payload) => {
  return request(`/box/typelist`, {
    data: payload,
    method: "GET",
  });
};

export const idnamelist = (payload) => {
  return request(`/box/idnamelist`, {
    data: payload,
    method: "GET",
  });
};

export const box_log_list = (payload) => {
  return request(`/box/box_log_list`, {
    data: payload,
    method: "GET",
  });
};

export const list = (payload) => {
  return request(`/box/list`, {
    data: payload,
    method: "GET",
  });
};

export const itemTypeAdd = (payload) => {
  return request(`/box/itemTypeAdd`, {
    data: payload,
    method: "POST",
  });
};

export const itemsAdd = (payload) => {
  return request(`/box/itemsAdd`, {
    data: payload,
    method: "POST",
  });
};

export const itemsUpdate = (payload) => {
  return request(`/box/itemsUpdate`, {
    data: payload,
    method: "POST",
  });
};

export const itemsOnline = (payload) => {
  return request(`/box/itemsOnline`, {
    data: payload,
    method: "POST",
  });
};

export const validBoxList = (payload) => {
  return request(`/box/validBoxList`, {
    data: payload,
    method: "GET",
  });
};
