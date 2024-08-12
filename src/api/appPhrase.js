import request from "@/utils/request";

//# 列表
export const appPhraseList = (payload) => {
    return request(`/app_phrase/list`, {
        data: payload,
        method: "GET",
    });
};

//# 新增
export const appPhraseAdd = (payload) => {
    return request(`/app_phrase/add`, {
        data: payload,
        method: "POST",
    });
};
//# 批量新增
export const appPhraseBatchAdd = (payload) => {
    return request(`/app_phrase/batch_add`, {
        data: payload,
        method: "POST",
    }, "application/json");
};
//# 删除
export const appPhraseDel = (payload) => {
    return request(`/app_phrase/del`, {
        data: payload,
        method: "POST",
    });
};
//# 更新
export const appPhraseUpdate = (payload) => {
    return request(`/app_phrase/update`, {
        data: payload,
        method: "POST",
    }, "application/json");
};
//# 上下线
export const appPhraseOnline = (payload) => {
    return request(`/app_phrase/online`, {
        data: payload,
        method: "POST",
    });
};
