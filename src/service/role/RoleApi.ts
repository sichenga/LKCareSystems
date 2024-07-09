// 角色管理 / 岗位管理
import { get, post, del } from "@/utils/request";
import type { Roletype, Addrole } from "./Roletype";
// 获取角色列表 /api/role/list
export const RoleList = (params?: Roletype) =>
  get("/api/role/list", params || {});

// 删除角色列表 /api/role/delete/
export const DelList = (id: number) => del("/api/role/delete/" + id);

// 获取角色权限 /api/menu/getListForUser
export const getList = () => get("/api/menu/getListForUser");

// 角色添加 /api/menu/getListForUser
export const Addroles = (data: Addrole) => post("/api/role/add", data);

// 获取单条角色 /api/menu/getListForUser
export const Rolesget = (id: number) => get("/api/role/get/" + id);

// 获取所有权限列表 /api/menu/list
export const getMenuList = () => get("/api/menu/list");
// 批量删除
export const deleteAll = (data: any) => post("/api/role/deleteAll", data);
