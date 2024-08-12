import request from "@/utils/request";

/**
    添加
 */
export const add = (payload) => {
    return request(`/app/add`, {
        data: payload,
        method: "POST",
    });
};

/**
    删除
 */
export const del = (payload) => {
    return request(`/app/del`, {
        data: payload,
        method: "POST",
    });
};

/**
    更新编辑
 */
export const update = (payload) => {
    return request(`/app/update`, {
        data: payload,
        method: "POST",
    });
};

/**
    列表获取
 */
export const list = (payload) => {
    return request(`/app/list`, {
        data: payload,
        method: "GET",
    });
};