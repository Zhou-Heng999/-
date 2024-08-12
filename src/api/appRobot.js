import request from "@/utils/request";

/**
    新增
 */
export const add = (payload) => {
    return request(`/app_robot/add`, {
        data: payload,
        method: "POST",
    });
};

/**
    更新
 */
export const update = (payload) => {
    return request(`/app_robot/update`, {
        data: payload,
        method: "POST",
    });
};

/**
    更新状态
 */
export const modify_status = (payload) => {
    return request(`/app_robot/modify_status`, {
        data: payload,
        method: "POST",
    });
};

/**
    列表
 */
export const list = (payload) => {
    return request(`/app_robot/list`, {
        data: payload,
        method: "GET",
    });
};