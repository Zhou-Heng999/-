import request from "@/utils/request";

export const getWalletSet = (payload) => {
  return request(`/wallet/getWalletSet`, {
    data: payload,
    method: "GET",
  });
};

export const getWalletRecordList = (payload) => {
  return request(`/wallet/getWalletRecordList`, {
    data: payload,
    method: "GET",
  });
};

export const editWalletSet = (payload) => {
  return request(`/wallet/editWalletSet`, {
    data: payload,
    method: "POST",
  });
};
