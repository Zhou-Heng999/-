import request from "@/utils/request";

/**
    设置保存
 */
export const set = (payload) => {
    return request(`/app_setting/set`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

/**
    列表
 */
export const list = (payload) => {
    return request(`/app_setting/list`, {
        data: payload,
        method: "GET",
    });
};