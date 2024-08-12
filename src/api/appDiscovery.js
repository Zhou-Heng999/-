import request from "@/utils/request";

/**
    新增
 */
export const add = (payload) => {
    return request(`/app_discovery/add`, {
        data: payload,
        method: "POST",
    });
};

/**
    更新
 */
export const update = (payload) => {
    return request(`/app_discovery/update`, {
        data: payload,
        method: "POST",
    });
};

/**
    上下线
 */
export const online = (payload) => {
    return request(`/app_discovery/online`, {
        data: payload,
        method: "POST",
    });
};

/**
    列表
 */
export const list = (payload) => {
    return request(`/app_discovery/list`, {
        data: payload,
        method: "GET",
    });
};

/**
    删除
 */
    export const del = (payload) => {
        return request(`/app_discovery/del`, {
            data: payload,
            method: "POST",
        });
    };