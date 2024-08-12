import request from "@/utils/request";

/**
    设备列表
 */
export const list = (payload) => {
    return request(`/app_device/list`, {
        data: payload,
        method: "GET",
    });
};