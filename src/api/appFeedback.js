import request from "@/utils/request";

/**
    列表
 */
export const feedbackList = (payload) => {
    return request(`/app_feedback/list`, {
        data: payload,
        method: "GET",
    });
};
/**
    回复
 */
export const feedbackReply = (payload) => {
    return request(`/app_feedback/reply`, {
        data: payload,
        method: "POST",
    });
};
/**
修改
*/
export const feedbackModifyStatus = (payload) => {
    return request(`/app_feedback/modify_status`, {
        data: payload,
        method: "POST",
    });
};