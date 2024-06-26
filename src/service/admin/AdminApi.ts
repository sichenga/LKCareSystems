import { del, get, post, put } from "@/utils/request";
import type { Login } from "./AdminType";
import { AccountAdd, AccountList } from "./AdminType";
// 用户登录 /api/auth/login
const adminLogin = (data: Login) => post("/api/auth/login", data);
//账号列表 /api/account/list
const adminList = (params: AccountList) => get("/api/account/list", params);
//根据账号ID获取账号信息 /api/account/get/40
const accountget = (id: number) => get(`/api/account/get/${id}`);
// 添加账号 /api/account/add
const accountadd = (data: AccountAdd) => post("/api/account/add", data);
//修改账号 /api/account/update
const accountupdate = (data: AccountAdd) => put("/api/account/update", data);
// 删除账号 /api/account/delete/28
const accountdelete = (id: number) => del(`/api/account/delete/${id}`);
//根据账号id获取角色列表 /api/role/listForAccount/51
const rolelistForAccount = (id: number) =>
  get(`/api/role/listForAccount/${id}`);
export {
  adminLogin,
  adminList,
  accountget,
  accountadd,
  accountdelete,
  rolelistForAccount,
};
