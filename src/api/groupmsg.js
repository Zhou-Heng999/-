import request from "@/utils/request";

// 群聊消息列表
export const list = (payload) => {
    return request(`/groupmsg/list`, {
        data: payload,
        method: "GET",
    });
};

// 清空群聊历史消息
export const clear_group_msg = (payload) => {
    return request(`/groupmsg/clear_group_msg`, {
        data: payload,
        method: "POST",
    });
};

// 发送群消息
export const send_group_msg = (payload) => {
    return request(`/groupmsg/send_group_msg`, {
        data: payload,
        method: "POST",
    });
};

// 在群组中发送系统通知
export const send_group_system_notification = (payload) => {
    return request(`/groupmsg/send_group_system_notification`, {
        data: payload,
        method: "POST",
    },"application/json");
};

// 修改群聊历史消息
export const modify_group_msg = (payload) => {
    return request(`/groupmsg/modify_group_msg`, {
        data: payload,
        method: "POST",
    });
};

// 删除指定用户发送的消息
export const delete_group_msg_by_sender = (payload) => {
    return request(`/groupmsg/delete_group_msg_by_sender`, {
        data: payload,
        method: "POST",
    });
};


// 删除群聊消息
export const del = (payload) => {
    return request(`/groupmsg/delete`, {
        data: payload,
        method: "POST",
    }, "application/json");
};