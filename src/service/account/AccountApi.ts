import { del, get, post, put } from "@/utils/request";
import type { AccountList, AddAccount, RoleList } from "./AccountType";
import { UnwrapNestedRefs } from "vue";
import { AccountAdd } from "@/service/admin/AdminType";
// 账号列表 /api/account/list
const accountlist = (data: AccountList) => get("/api/account/list", data);
// 添加账号 /api/account/add
const accountadd = (data: AddAccount) => post("/api/account/add", data);
// 修改账号 /api/account/update
const accountupdate = (data: UnwrapNestedRefs<AccountAdd>) =>
  put("/api/account/update", data);
// 根据账号ID获取账号信息 /api/account/get/50
const accountinfo = (id: number) => get(`/api/account/get/${id}`);
// 根据账号id获取角色列表 /api/role/listForAccount/51
const rolelistForAccount = (id: number) =>
  get(`/api/role/listForAccount/${id}`);
// 删除账号 /api/account/delete/28
const accountdel = (id: number) => del(`/api/account/delete/${id}`);
// 角色列表 /api/role/list
const rolelist = (params?: RoleList) => get("/api/role/list", params);
// 获取登录用户权限 /api/menu/getListForUser
const getListForUser = () => get("/api/menu/getListForUser");

export {
  accountlist,
  accountadd,
  accountdel,
  accountinfo,
  rolelist,
  rolelistForAccount,
  accountupdate,
  getListForUser,
};
