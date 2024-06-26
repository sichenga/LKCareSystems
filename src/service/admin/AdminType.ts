// 用户登录 /api/auth/login
export interface Login {
  username: string;
  pwd: string;
}
//账号列表 /api/account/list
export interface AccountList {
  page: number;
  pageSize: number;
}
// 添加账号 /api/account/add
export interface AccountAdd {
  username: string;
  pwd: string;
  name: string;
  photo: string;
  mobile: string;
  roleIds: number[];
}
