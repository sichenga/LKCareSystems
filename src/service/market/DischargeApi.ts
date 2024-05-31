import { get, post, put, del } from "@/utils/request";
import type { dischargeListParams, dischargeAddParams } from "./DischargeType";

// 出院列表
export const dischargeList = (params: dischargeListParams) => {
  return get("/api/discharge/list", params);
};
// 获取单条出院信息
export const dischargeGet = (id: number) => {
  return get(`/api/discharge/get/${id}`);
};
// 删除出院信息
export const dischargeDelete = (id: number) => {
  return del(`/api/discharge/delete/${id}`);
};
// 添加出院信息
export const dischargeAdd = (data: dischargeAddParams) => {
  return post("/api/discharge/add", data);
};

// 修改出院信息
export const dischargeUpdate = (data: dischargeAddParams) => {
  return put("/api/discharge/update", data);
};
