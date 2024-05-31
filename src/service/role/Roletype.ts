// 角色列表
export interface Roletype {
  page: number;
  pageSize: number;
}
// 增加角色
export interface Addrole {
  id: number;
  name: string;
  menuIds: Array<number> | undefined;
}

// 权限列表
export interface RoleList {
  id: number;
  name: string;
  icon: string;
  url: string;
  pathName: string;
  pid: number;
  sort: number;
  type: number;
  isButton: number;
  children?: Array<RoleList>;
}
