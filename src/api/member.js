import request from "@/utils/request";

/**
 会员新建
 */
export const addTguser = (payload) => {
  return request(`/tguser/add`, {
    data: payload,
    method: "POST",
  });
};

/**
 会员修改
 */
export const updateTguser = (payload) => {
  return request(`/tguser/update`, {
    data: payload,
    method: "POST",
  });
};

/**
 会员列表
 */
export const qryTguser = (payload) => {
  return request(`/tguser/qry`, {
    data: payload,
    method: "GET",
  });
};

// 新手礼包详情

export const qryGift = (payload) => {
  return request(`/gift/qry`, {
    data: payload,
    method: "GET",
  });
};

// 会员投资报表

export const reportProduct = (payload) => {
  return request(`/product/report`, {
    data: payload,
    method: "GET",
  });
};

// 产品订单详情

export const orderProduct = (payload) => {
  return request(`/product/order`, {
    data: payload,
    method: "GET",
  });
};

// 订单分红详情

export const bonusOrder = (payload) => {
  return request(`/order/bonus`, {
    data: payload,
    method: "GET",
  });
};

// 购买代理订单

export const buyAgent = (payload) => {
  return request(`/agent/buy`, {
    data: payload,
    method: "GET",
  });
};

// 代理列表

export const agentList = (payload) => {
  return request(`/agent/list`, {
    data: payload,
    method: "GET",
  });
};

// 团队数据

export const agentTeam = (payload) => {
  return request(`/agent/team`, {
    data: payload,
    method: "GET",
  });
};

// 代理配置添加

export const agentCreate = (payload) => {
  return request(`/agent/create`, {
    data: payload,
    method: "POST",
  });
};

// 代理配置修改

export const agentUpdate = (payload) => {
  return request(`/agent/update`, {
    data: payload,
    method: "POST",
  });
};

// 代理类型列表

export const agentQry = (payload) => {
  return request(`/agent/qry`, {
    data: payload,
    method: "GET",
  });
};

export const agentRate = (payload) => {
  return request(`/agent/rate`, {
    data: payload,
    method: "POST",
  });
};

// 发放分红记录

export const bonusSendLog = (payload) => {
  return request(`/bonus/sendLog`, {
    data: payload,
    method: "GET",
  });
};
