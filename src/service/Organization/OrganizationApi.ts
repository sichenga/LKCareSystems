import { get, post, del } from "@/utils/request";
import type { companyaddParams, companylistParams } from "./OrganizationType";
// 机构列表
export const companylist = (params: companylistParams) =>
  get("/api/company/list", params);
// 增加/修改机构
export const companyadd = (data: companyaddParams) =>
  post("/api/company/add", data);
export const companydelete = (id: number) => del("/api/company/delete/" + id);
//获取单条数据
export const companyget = (id: number) => get("/api/company/get/" + id);
// 获取省市 /api/company/getCity
export const getCity = () => get("/api/company/getCity");
// 批量删除
export const deleteAll = (data: any) => post("/api/company/deleteAll", data);
