import { get, put, post } from "@/utils/request";
import type { IUser, IUserList } from "./PurchaseType";

// 采购申请列表
export const getPurchaseList = (params: IUser) => {
  return get("/api/purchase/list", params);
};
// 根据id获取单条采购申请信息
export const getPurchase = (id: number) => {
  return get("/api/purchase/get/" + id);
};
// 根据采购id获取采购物品列表
export const getpurchaseFoods = (id: number) => {
  return get("/api/purchaseFoods/list/" + id);
};
// 收货验货
export const putInspection = (params: any) => {
  return put("/api/purchase/check", params);
};
//  采购申请
export const postInspection = (data: IUserList) => {
  return post("/api/purchase/add", data);
};
