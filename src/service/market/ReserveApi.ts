import { get, post, put, del } from "@/utils/request";
import type { ReservationParams, ReservationAddParams } from "./Reservetype";

// 预定列表
export const reservationList = (params: ReservationParams) => {
  return get("/api/reservation/list", params || {});
};
// 获取单条预定信息
export const reservationget = (id: number) => {
  return get(`/api/reservation/get/${id}`);
};
// 删除预定信息
export const reservationDelete = (id: number) => {
  return del(`/api/reservation/delete/${id}`);
};

// 批删预定登记
export const reservationAll = (ids: any) => {
  return post("/api/reservation/deleteAll", ids);
};

// 预定添加
export const reservationAdd = (data: ReservationAddParams) => {
  return post("/api/reservation/add", data);
};

// 预定信息修改
export const reservationUpdate = (data: ReservationAddParams) => {
  return put("/api/reservation/update", data);
};
