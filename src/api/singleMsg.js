import request from "@/utils/request";

// 群聊消息列表
export const list = (payload) => {
    return request(`/c2cmsg/list`, {
        data: payload,
        method: "GET",
    });
};

// 删除单向消息
export const delete_c2c_msg_ramble = (payload) => {
    return request(`/c2cmsg/delete_c2c_msg_ramble`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

// 删除双向消息
export const delete_c2c_msg_both = (payload) => {
    return request(`/c2cmsg/delete_c2c_msg_both`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

// 发送单聊消息
export const send_msg = (payload) => {
    return request(`/c2cmsg/send_msg`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

// 批量发单聊消息
export const batch_send_msg = (payload) => {
    return request(`/c2cmsg/batch_send_msg`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

// 修改单聊历史消息
export const modify_c2c_msg = (payload) => {
    return request(`/c2cmsg/modify_c2c_msg`, {
        data: payload,
        method: "POST",
    }, "application/json");
};