import request from "@/utils/request";

/**
 添加角色
 */
export const roleAdd = (payload) => {
  return request(`/role/add`, {
    data: payload,
    method: "POST",
  });
};

/**
 修改角色
 */
export const roleUpdate = (payload) => {
  return request(`/role/update`, {
    data: payload,
    method: "POST",
  });
};

/**
 查询角色列表
 */
export const roleQry = (payload) => {
  return request(`/role/qry`, {
    data: payload,
    method: "GET",
  });
};

// 查询菜单组
export const menuGroup = (payload) => {
  return request(`/menu/group`, {
    data: payload,
    method: "GET",
  });
};

// 查询所有菜单组
export const menuGroup2 = (payload) => {
  return request(`/menu/group2`, {
    data: payload,
    method: "GET",
  });
};

// 查询菜单列表
export const menuQry = (payload) => {
  return request(`/menu/list`, {
    data: payload,
    method: "GET",
  });
};

export const menuAdd = (payload) => {
  return request(`/menu/add`, {
    data: payload,
    method: "POST",
  });
};

export const menuUpdate = (payload) => {
  return request(`/menu/mod`, {
    data: payload,
    method: "POST",
  });
};

// 删除菜单

export const delete_menu = (payload) => {
  return request(`/menu/del`, {
    data: payload,
    method: "POST",
  });
};
