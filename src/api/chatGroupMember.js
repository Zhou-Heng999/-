import request from "@/utils/request";

//群组成员列表
export const list = (payload) => {
    return request(`/chat_group_member/list`, {
        data: payload,
        method: "GET",
    });
};

//添加群成员
export const add = (payload) => {
    return request(`/chat_group_member/add`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

//删除群成员
export const del = (payload) => {
    return request(`/chat_group_member/del`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

//封禁群成员
export const ban = (payload) => {
    return request(`/chat_group_member/ban`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

//解禁群成员
export const unban = (payload) => {
    return request(`/chat_group_member/unban`, {
        data: payload,
        method: "POST",
    });
};

//导入群成员
export const import_group_member = (payload) => {
    return request(`/chat_group_member/import_group_member`, {
        data: payload,
        method: "POST",
    });
};


//修改群成员资料
export const modify_group_member_info = (payload) => {
    return request(`/chat_group_member/modify_group_member_info`, {
        data: payload,
        method: "POST",
    });
};

//禁言群成员
export const forbid_send_msg = (payload) => {
    return request(`/chat_group_member/forbid_send_msg`, {
        data: payload,
        method: "POST",
    }, "application/json");
};