import request from "@/utils/request";

/**
    好友列表
*/
export const list = (payload) => {
    return request(`/app_user_friend/list`, {
        data: payload,
        method: "GET",
    });
};

/**
    加好友
*/
export const add = (payload) => {
    return request(`/app_user_friend/add`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

/**
    删除好友
*/
export const del = (payload) => {
    return request(`/app_user_friend/del`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

/**
    删除所有好友
*/
export const del_all = (payload) => {
    return request(`/app_user_friend/del_all`, {
        data: payload,
        method: "POST",
    }, "application/json");
};