import request from "@/utils/request";

// 群聊列表
export const list = (payload) => {
    return request(`/chat_group/list`, {
        data: payload,
        method: "GET",
    });
};

//转让群主
export const change_owner = (payload) => {
    return request(`/chat_group/change_owner`, {
        data: payload,
        method: "POST",
    });
};

//解散群组
export const destroy_group = (payload) => {
    return request(`/chat_group/destroy_group`, {
        data: payload,
        method: "POST",
    });
};

// 禁言群全体成员
export const forbid_group_all_member = (payload) => {
    return request(`/chat_group/forbid_group_all_member`, {
        data: payload,
        method: "POST",
    });
};