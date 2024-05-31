// 夜巡列表 /api/patrol/list
export interface PatrolList {
  page: number;
  pageSize: number;
  name: string;
  address: string;
  state: number | undefined;
  beginDate: string;
  endDate: string;
}

// 夜巡添加 /api/patrol/add
export interface PatrolAdd {
  address: string;
  state: string;
  comment: string;
}

// 选择地址
export interface AddressSelect {
  id: number;
  name: string;
}
