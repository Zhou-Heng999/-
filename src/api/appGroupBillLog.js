import request from "@/utils/request";

/**
    添加
 */
export const list = (payload) => {
    return request(`/app_group_bill_log/list`, {
        data: payload,
        method: "GET",
    });
};