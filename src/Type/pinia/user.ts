export interface Model {
  id: number;
  companyId: number;
  level: number;
  staffId: number;
  name: string;
  pwd: null;
  type: number;
  enable: number;
  mobile: string;
  username: string;
  roleIds: null;
}

// 权限
export interface Permission {
  id: number;
  name: string;
  icon: string;
  url: string;
  pathName: string;
  pid: number;
  sort: number;
  type: number;
  isButton: number;
  children: Array<Permission>;
}
