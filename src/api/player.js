import request from "@/utils/request";

/**
 查询玩家列表
 */
export const playerQry = (payload) => {
  return request(`/players/qry`, {
    data: payload,
    method: "GET",
  });
};

/**
 查询玩家信息
 */
export const playerInfoQry = (payload) => {
  return request(`/playerinfo/qry`, {
    data: payload,
    method: "GET",
  });
};

export const rechargeList = (payload) => {
  return request(`/playerinfo/getRechargeList`, {
    data: payload,
    method: "GET",
  });
}

export const withdrawList = (payload) => {
  return request(`/playerinfo/getWithdrawList`, {
    data: payload,
    method: "GET",
  });
}

// 查询认证信息
export const authInfo = (payload) => {
  return request(`/playerinfo/getAuthInfo`, {
    data: payload,
    method: "GET",
  });
}

// 修改认证信息
export const editAuthInfo = (payload) => {
  return request(`/playerinfo/editAuthInfo`, {
    data: payload,
    method: "POST",
  });
}

// 重置提现密码
export const resetWithdrawPwd = (payload) => {
  return request(`/playerinfo/resetWithdrawPwd`, {
    data: payload,
    method: "POST",
  });
}

// 修改上级
export const editUserProxy = (payload) => {
  return request(`/playerinfo/editUserProxy`, {
    data: payload,
    method: "POST",
  });
}

// 冻结/解冻下级状态
export const updateUserChildStatus = (payload) => {
  return request(`/playerinfo/updateUserChildStatus`, {
    data: payload,
    method: "POST",
  });
}

// 冻结/解冻下级资金状态
export const editUserAccountStatus = (payload) => {
  return request(`/playerinfo/editUserAccountStatus`, {
    data: payload,
    method: "POST",
  });
}

// 重置密码
export const resetPasswd = (payload) => {
  return request(`/playerinfo/resetPassword`, {
    data: payload,
    method: "POST",
  });
}

// 冻结/解冻下级资金状态
export const editUserStatus = (payload) => {
  return request(`/playerinfo/editUserStatus`, {
    data: payload,
    method: "POST",
  });
}

// 冻结/解冻下级资金状态
export const editAccountStatus = (payload) => {
  return request(`/playerinfo/editAccountStatus`, {
    data: payload,
    method: "POST",
  });
}

// 查询注册统计数据
export const sta = (payload) => {
  return request(`/playerinfo/sta`, {
    data: payload,
    method: "GET",
  });
}

export const getAllUserList = (payload) => {
  return request(`/playerinfo/getAllUserList`, {
    data: payload,
    method: "GET",
  });
}

export const getTodayUserList = (payload) => {
  return request(`/playerinfo/getTodayUserList`, {
    data: payload,
    method: "GET",
  });
}

export const getUserBalanceList = (payload) => {
  return request(`/playerinfo/getUserBalanceList`, {
    data: payload,
    method: "GET",
  });
}

export const getUserBalanceSta = (payload) => {
  return request(`/playerinfo/getUserBalanceSta`, {
    data: payload,
    method: "GET",
  });
}

export const getWhiteList = (payload) => {
  return request(`/playerinfo/getWhiteList`, {
    data: payload,
    method: "GET",
  });
}

export const addWhite = (payload) => {
  return request(`/playerinfo/addWhite`, {
    data: payload,
    method: "POST",
  });
}

export const deleteWhite = (payload) => {
  return request(`/playerinfo/deleteWhite`, {
    data: payload,
    method: "POST",
  });
}

export const getCapitalList = (payload) => {
  return request(`/playerinfo/getCapitalList`, {
    data: payload,
    method: "GET",
  });
}

export const getCapitalUsdtList = (payload) => {
  return request(`/playerinfo/getCapitalUsdtList`, {
    data: payload,
    method: "GET",
  });
}

export const addBlack = (payload) => {
  return request(`/playerinfo/addBlack`, {
    data: payload,
    method: "POST",
  });
}
