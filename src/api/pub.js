import request from "@/utils/request";

/**
 查询广告列表
 */
export const getAd = (payload) => {
  return request(`/pub/getAd`, {
    data: payload,
    method: "GET",
  });
};

/**
 添加广告
 */
export const adAdd = (payload) => {
  return request(`/pub/addAd`, {
    data: payload,
    method: "POST",
  });
};

/**
 获取某个广告信息
 */
export const getAdInfo = (payload) => {
  return request(`/pub/getAdInfo`, {
    data: payload,
    method: "POST",
  });
};

/**
 修改某个广告信息
 */
export const editAd = (payload) => {
  return request(`/pub/editAd`, {
    data: payload,
    method: "POST",
  });
};

/**
 删除某个广告信息
 */
export const delAd = (payload) => {
    return request(`/pub/delAd`, {
        data: payload,
        method: "POST",
    });
};

/**
 上线/下线
 */
export const upAd = (payload) => {
    return request(`/pub/upAd`, {
        data: payload,
        method: "POST",
    });
};

/**
 查询公告列表
 */
export const getNotice = (payload) => {
    return request(`/pub/getNotice`, {
        data: payload,
        method: "GET",
    });
};

/**
 添加公告
 */
export const addNotice = (payload) => {
    return request(`/pub/addNotice`, {
        data: payload,
        method: "POST",
    });
};

/**
 修改公告
 */
export const editNotice = (payload) => {
    return request(`/pub/editNotice`, {
        data: payload,
        method: "POST",
    });
};

/**
 公告 上线/下线
 */
export const upNotice = (payload) => {
    return request(`/pub/upNotice`, {
        data: payload,
        method: "POST",
    });
};

/**
 删除公告
 */
export const delNotice = (payload) => {
    return request(`/pub/delNotice`, {
        data: payload,
        method: "POST",
    });
};

/**
 保存弹窗信息
 */
export const savePop = (payload) => {
    return request(`/pub/savePop`, {
        data: payload,
        method: "POST",
    });
};

/**
 查询弹窗信息
 */
export const getPopup = (payload) => {
    return request(`/pub/getPopup`, {
        data: payload,
        method: "GET",
    });
};
