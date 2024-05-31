// 账号列表
export interface AccountList {
  pageSize: number;
  page: number;
}
// 增加账号
export interface AddAccount {
  id: number;
  username: string;
  pwd: string;
  name: string;
  enable: number;
  mobile: string;
  roleIds: Array<number>;
}

// 角色列表
export interface RoleList {
  pageSize: number;
  page: number;
}
// 选择角色
export interface Role {
  id: number;
  name: string;
}
