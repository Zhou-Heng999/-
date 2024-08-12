import request from "@/utils/request";

export const getRevenue = (payload) => {
  return request(`/report/getRevenue`, {
    data: payload,
    method: "POST",
  });
};
