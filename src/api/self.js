import request from "@/utils/request";

/**
    添加
 */
export const modgooglesecret = (payload) => {
    return request(`/self/modgooglesecret`, {
        data: payload,
        method: "POST",
    });
};