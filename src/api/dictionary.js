import request from "@/utils/request";

//# 添加字典
export const add = (payload) => {
  return request(`/dictionary/add`, {
    data: payload,
    method: "POST",
  });
};

//# 删除字典
export const del = (payload) => {
  return request(`/dictionary/del`, {
    data: payload,
    method: "POST",
  });
};

//# 编辑字典
export const update = (payload) => {
  return request(`/dictionary/update`, {
    data: payload,
    method: "POST",
  });
};

//# 字典列表
export const list = (payload) => {
  return request(`/dictionary/list`, {
    data: payload,
    method: "GET",
  });
};
