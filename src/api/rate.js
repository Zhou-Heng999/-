import request from "@/utils/request";

//汇率列表
export const getQry = (payload) => {
  return request(`/rate/qry`, {
    data: payload,
    method: "GET",
  });
};

//汇率添加
export const add = (payload) => {
  return request(`/rate/add`, {
    data: payload,
    method: "POST",
  });
};
//汇率编辑
export const edit = (payload) => {
  return request(`/rate/edit`, {
    data: payload,
    method: "POST",
  });
};
//汇率删除
export const del = (payload) => {
  return request(`/rate/del`, {
    data: payload,
    method: "POST",
  });
};

