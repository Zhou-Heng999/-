import request from "@/utils/request";

//# 操作日志
export const oplogList = (payload) => {
  return request(`system/oplog/list`, {
    data: payload,
    method: "GET",
  });
};
