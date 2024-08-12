import request from "@/utils/request";

/**
 产品新建
 */
export const create = (payload) => {
  return request(`/product/create`, {
    data: payload,
    method: "POST",
  });
};

/**
 产品修改
 */
export const update = (payload) => {
  return request(`/product/update`, {
    data: payload,
    method: "POST",
  });
};

/**
 产品列表
 */
export const qry = (payload) => {
  return request(`/product/qry`, {
    data: payload,
    method: "GET",
  });
};

/**
 上传图片
 */
export const uploadImg = (payload) => {
  return request(`/uploadImg`, {
    data: payload,
    method: "POST",
  });
};

/**
 礼包创建
 */
export const giftCreate = (payload) => {
  return request(`/gift/create`, {
    data: payload,
    method: "POST",
  });
};

/**
礼包修改
 */
export const giftUpdate = (payload) => {
  return request(`/gift/update`, {
    data: payload,
    method: "POST",
  });
};

/**
 礼包列表
 */
export const giftList = (payload) => {
  return request(`/gift/list`, {
    data: payload,
    method: "GET",
  });
};

/**
 每日产品数据
 */
export const dailyList = (payload) => {
  return request(`/daily/report`, {
    data: payload,
    method: "GET",
  });
};
