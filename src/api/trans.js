import request from "@/utils/request";

/**
 查询待充值
 */
export const getWaitTransList = (payload) => {
  return request(`/trans/getWaitTransList`, {
    data: payload,
    method: "GET",
  });
};

/**
 查询历史充值
 */
export const getHistoryTransList = (payload) => {
  return request(`/trans/getHistoryTransList`, {
    data: payload,
    method: "GET",
  });
};

/**
 充值
 */
export const recharge = (payload) => {
  return request(`/trans/recharge`, {
    data: payload,
    method: "POST",
  });
};

/**
 批量删除充值
 */
export const deleteRecharge = (payload) => {
  return request(`/trans/deleteRecharge`, {
    data: payload,
    method: "POST",
  });
};

/**
 充值统计
 */
export const getRechargeSta = (payload) => {
  return request(`/trans/getRechargeSta`, {
    data: payload,
    method: "GET",
  });
};

/**
 充值统计 usdt
 */
export const getRechargeUsdtSta = (payload) => {
  return request(`/trans/getRechargeUsdtSta`, {
    data: payload,
    method: "GET",
  });
};

/**
 确定上分
 */
export const confirm_recharge = (payload) => {
  return request(`/trans/confirmRecharge`, {
    data: payload,
    method: "POST",
  });
};

/**
 主动查询
 */
export const query_trans_status = (payload) => {
  return request(`/trans/queryTransStatus`, {
    data: payload,
    method: "POST",
  });
};

/**
 查询待提现
 */
export const getWaitWithdrawList = (payload) => {
  return request(`/trans/getWaitWithdrawList`, {
    data: payload,
    method: "GET",
  });
};

/**
 查询待提现
 */
export const getHistoryWithdrawList = (payload) => {
  return request(`/trans/getHistoryWithdrawList`, {
    data: payload,
    method: "GET",
  });
};

/**
 修改交易状态
 */
export const edit_trans_status = (payload) => {
  return request(`/trans/editTransStatus`, {
    data: payload,
    method: "POST",
  });
};

/**
 扣款
 */
export const withdraw = (payload) => {
  return request(`/trans/withdraw`, {
    data: payload,
    method: "POST",
  });
};

/**
 拒绝
 */
export const refuse_withdraw = (payload) => {
  return request(`/trans/refuseWithdraw`, {
    data: payload,
    method: "POST",
  });
};

/**
 提现统计
 */
export const getWithdrawSta = (payload) => {
  return request(`/trans/getWithdrawSta`, {
    data: payload,
    method: "GET",
  });
};

/**
 提现统计 usdt
 */
export const getWithdrawUsdtSta = (payload) => {
  return request(`/trans/getWithdrawUsdtSta`, {
    data: payload,
    method: "GET",
  });
};

/**
 保存 充提设置
 */
export const edit_trans_type = (payload) => {
  return request(`/trans/editTransType`, {
    data: payload,
    method: "POST",
  });
};

/**
 查看 充提设置
 */
export const get_trans_type = (payload) => {
  return request(`/trans/getTransType`, {
    data: payload,
    method: "GET",
  });
};

/**
 查看 银行信息
 */
export const get_bank_info = (payload) => {
  return request(`/trans/getBankInfo`, {
    data: payload,
    method: "GET",
  });
};

/**
 保存 银行信息
 */
export const edit_bank_info = (payload) => {
  return request(`/trans/editBankInfo`, {
    data: payload,
    method: "POST",
  });
};

/**
 删除 银行信息
 */
export const del_bank_info = (payload) => {
  return request(`/trans/deleteBankInfo`, {
    data: payload,
    method: "POST",
  });
};

/**
 充提统计
 */
export const getSta = (payload) => {
  return request(`/trans/getSta`, {
    data: payload,
    method: "GET",
  });
};

/**
 查询 划转设置
 */
export const get_transfer_info = (payload) => {
    return request(`/trans/getTransferInfo`, {
        data: payload,
        method: "GET",
    });
};

/**
 保存 划转设置
 */
export const edit_transfer_info = (payload) => {
    return request(`/trans/editTransfer`, {
        data: payload,
        method: "POST",
    });
};

/**
 查询 划转记录
 */
export const get_transfer_list = (payload) => {
  return request(`/trans/getTransferList`, {
    data: payload,
    method: "GET",
  });
};

/**
 修改 划转记录 状态
 */
export const edit_transfer_status = (payload) => {
  return request(`/trans/editTransferStatus`, {
    data: payload,
    method: "POST",
  });
};

/**
 查询 充值商户列表
 */
export const sell_user_list = (payload) => {
  return request(`/trans/sellUserList`, {
    data: payload,
    method: "GET",
  });
};

/**
 增加 充值商户
 */
export const add_seller = (payload) => {
  return request(`/trans/addSeller`, {
    data: payload,
    method: "POST",
  });
};

/**
 编辑 充值商户
 */
export const edit_seller = (payload) => {
  return request(`/trans/editSeller`, {
    data: payload,
    method: "POST",
  });
};

/**
 删除 充值商户
 */
export const del_seller = (payload) => {
  return request(`/trans/deleteSeller`, {
    data: payload,
    method: "POST",
  });
};

/**
 查询 提现商户列表
 */
export const buy_user_list = (payload) => {
  return request(`/trans/buyerUserList`, {
    data: payload,
    method: "GET",
  });
};

/**
 增加 提现商户
 */
export const add_buyer = (payload) => {
  return request(`/trans/addBuyer`, {
    data: payload,
    method: "POST",
  });
};

/**
 编辑 提现商户
 */
export const edit_buyer = (payload) => {
  return request(`/trans/editBuyer`, {
    data: payload,
    method: "POST",
  });
};

/**
 删除 提现商户
 */
export const del_buyer = (payload) => {
  return request(`/trans/deleteBuyer`, {
    data: payload,
    method: "POST",
  });
};
