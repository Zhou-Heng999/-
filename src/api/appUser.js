import request from "@/utils/request";

/**
    列表
 */
export const list = (payload) => {
    return request(`/app_user/list`, {
        data: payload,
        method: "GET",
    });
};

/**
    修改会员密码
 */
export const modify_password = (payload) => {
    return request(`/app_user/modify_password`, {
        data: payload,
        method: "POST",
    });
};

/**
生成虚拟用户
*/
export const gen_virtual_user = (payload) => {
    return request(`/app_user/gen_virtual_user`, {
        data: payload,
        method: "POST",
    });
};

/**
修改用户状态
*/
export const modify_status = (payload) => {
    return request(`/app_user/modify_status`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

/**
拉取会员资料
*/
export const portrait_get = (payload) => {
    return request(`/app_user/portrait_get`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

/**
修改会员资料
*/
export const portrait_set = (payload) => {
    return request(`/app_user/portrait_set`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

/**
查询全局禁言状态
*/
export const getnospeaking = (payload) => {
    return request(`/app_user/getnospeaking`, {
        data: payload,
        method: "POST",
    });
};

/**
设置全局禁言状态
*/
export const setnospeaking = (payload) => {
    return request(`/app_user/setnospeaking`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

/**
获取用户信息
*/
export const info = (payload) => {
    return request(`/app_user/info`, {
        data: payload,
        method: "GET",
    });
};

/**
导入账号
*/
export const import_account = (payload) => {
    return request(`/app_user/import_account`, {
        data: payload,
        method: "POST",
    }, "application/json");
};

/**
上传图片数据
*/
export const postPolicy = (payload) => {
    return request(`/app_user/post-policy`, {
        data: payload,
        method: "GET",
    });
};

/**
    特权会员列表
 */
export const privilege_list = (payload) => {
    return request(`/app_user/privilege_list`, {
        data: payload,
        method: "GET",
    });
};
/**
   分配特权
 */
export const privilege_grant = (payload) => {
    return request(`/app_user/privilege_grant`, {
        data: payload,
        method: "POST",
    });
};
/**
   特权注册
 */
export const privilege_register = (payload) => {
    return request(`/app_user/privilege_register`, {
        data: payload,
        method: "POST",
    });
};
/**
   撤销特权
 */
export const privilege_revoke = (payload) => {
    return request(`/app_user/privilege_revoke`, {
        data: payload,
        method: "POST",
    });
};
