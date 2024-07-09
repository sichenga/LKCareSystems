import { get, post, put, del } from "@/utils/request";
import type { AddressList, AddressAdd } from "./AddressType";
// 地址列表 /api/address/list
export const addresslist = (params?: AddressList) =>
  get("/api/address/list", params);
// 地址添加 /api/address/add
export const addressadd = (data: AddressAdd) => post("/api/address/add", data);
// 地址修改 /api/address/update
export const addressupdate = (data: AddressAdd) =>
  put("/api/address/update", data);
// 地址删除  /api/address/delete/3
export const addressdelete = (id: number) => del(`/api/address/delete/${id}`);

// 批量删除
export const addressdeleteAll = (ids: any) =>
  post("/api/address/deleteAll", ids);
