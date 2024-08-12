import request from "@/utils/request";

/**
 
 */
export const s = (payload) => {
  return request(`/playerinfo/editLeverage`, {
    data: payload,
    method: "GET",
  });
};
/**
    修改杠杆
 */
export const editLeverage = (payload) => {
  return request(`/playerinfo/editLeverage`, {
    data: payload,
    method: "POST",
  });
}

/**
    开户信息
 */
    export const marketAccountInfo = (payload) => {
      return request(`/playerinfo/marketAccountInfo`, {
        data: payload,
        method: "POST",
      });
    }
