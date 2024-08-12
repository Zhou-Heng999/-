import request from "@/utils/request";

export const add = (payload) => {
    return request(`/channel/add`, {
        data: payload,
        method: "POST",
    });
};


export const del = (payload) => {
    return request(`/channel/del`, {
        data: payload,
        method: "POST",
    });
};


export const update = (payload) => {
    return request(`/channel/update`, {
        data: payload,
        method: "POST",
    });
};


export const list = (payload) => {
    return request(`/channel/list`, {
        data: payload,
        method: "GET",
    });
};

// 上下线
export const online = (payload) => {
    return request(`/channel/online`, {
        data: payload,
        method: "POST",
    });
};

// 当前渠道
export const cur = (payload) => {
    return request(`/channel/cur`, {
        data: payload,
        method: "GET",
    });
};


// 
export const show = (payload) => {
    return request(`/channel/show`, {
        data: payload,
        method: "GET",
    });
};