import request from "@/utils/request";

/**
    黑名单列表
 */
export const list = (payload) => {
    return request(`/app_user_black/list`, {
        data: payload,
        method: "GET",
    });
};

/**
    添加到黑名单
 */
export const add = (payload) => {
    return request(`/app_user_black/add`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

/**
    从黑名单中删除
 */
export const del = (payload) => {
    return request(`/app_user_black/del`, {
        data: payload,
        method: "POST",
    }, "application/json");
};