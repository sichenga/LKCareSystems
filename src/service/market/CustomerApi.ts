import { get, post, put, del } from "@/utils/request";
import type { CustomerParams, CustomerAddType } from "./CustomerType";

// 潜在客户列表
export const CustomerList = (params?: CustomerParams) => {
  return get("/api/customer/list", params || {});
};

// 删除潜在客户
export const CustomerDelete = (id: number) => {
  return del(`/api/customer/delete/${id}`);
};

// 获取单条客户信息
export const Customerget = (id: number) => {
  return get(`/api/customer/get/${id}`);
};
// 潜在客户添加
export const CustomerAdd = (data: CustomerAddType) => {
  return post("/api/customer/add", data);
};

// 潜在客户修改
export const Customerupdate = (data: CustomerAddType) => {
  return put("/api/customer/update", data);
};
