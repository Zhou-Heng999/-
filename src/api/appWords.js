import request from "@/utils/request";

//# 列表
export const appWordsList = (payload) => {
    return request(`/app_words/list`, {
        data: payload,
        method: "GET",
    });
};

//# 新增
export const appWordsAdd = (payload) => {
    return request(`/app_words/add`, {
        data: payload,
        method: "POST",
    });
};
//# 批量新增
export const appWordsBatchAdd = (payload) => {
    return request(`/app_words/batch_add`, {
        data: payload,
        method: "POST",
    }, "application/json");
};
//# 删除
export const appWordsDel = (payload) => {
    return request(`/app_words/del`, {
        data: payload,
        method: "POST",
    });
};
//# 更新
export const appWordsUpdate = (payload) => {
    return request(`/app_words/update`, {
        data: payload,
        method: "POST",
    });
};
//# 上下线
export const appWordsOnline = (payload) => {
    return request(`/app_words/online`, {
        data: payload,
        method: "POST",
    });
};
