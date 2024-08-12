import request from "@/utils/request";

//# 新股列表
export const list = (payload) => {
  return request(`/newshares/list`, {
    data: payload,
    method: "GET",
  });
};

//# 添加新股
export const add = (payload) => {
  return request(`/newshares/add`, {
    data: payload,
    method: "POST",
  });
};

//# 修改指数
export const edit = (payload) => {
  return request(`/newshares/edit`, {
    data: payload,
    method: "POST",
  });
};

//# 删除新股
export const del = (payload) => {
  return request(`/newshares/del`, {
    data: payload,
    method: "POST",
  });
};
