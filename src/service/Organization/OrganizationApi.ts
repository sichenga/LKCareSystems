import { get, post, del } from "@/utils/request";
import type { companyaddParams, companylistParams } from "./OrganizationType";
export const companylist = (params: companylistParams) =>
  get("/api/company/list", params);
export const companyadd = (data: companyaddParams) =>
  post("/api/company/add", data);
export const companydelete = (id: number) => del("/api/company/delete/" + id);
//获取单条数据
export const companyget = (id: number) => get("/api/company/get/" + id);
