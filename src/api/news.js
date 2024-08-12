import request from "@/utils/request";

/**
 
 */
export const newsList = (payload) => {
    return request(`/news/list`, {
        data: payload,
        method: "GET",
    });
};
/**
    修改
 */
export const edit = (payload) => {
    return request(`/news/edit`, {
        data: payload,
        method: "POST",
    });
}

/**
    开户信息
 */
export const add = (payload) => {
    return request(`/news/add`, {
        data: payload,
        method: "POST",
    });
}

/**
    开户信息
 */
export const del = (payload) => {
    return request(`/news/del`, {
        data: payload,
        method: "POST",
    });
}
