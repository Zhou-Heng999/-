import request from "@/utils/request";

//# 指数列表
export const list = (payload) => {
  return request(`/index/list`, {
    data: payload,
    method: "GET",
  });
};

//# 添加指数
export const add = (payload) => {
  return request(`/index/add`, {
    data: payload,
    method: "POST",
  });
};

//# 修改指数
export const edit = (payload) => {
  return request(`/index/edit`, {
    data: payload,
    method: "POST",
  });
};
