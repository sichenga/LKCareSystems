// 潜在客户列表
export interface CustomerParams {
  page: number;
  pageSize: number;
  name: string;
  idCard: string;
  beginDate: string;
  state: number | null;
  endDate: string;
}

//潜在客户添加
export interface CustomerAddType {
  name: string;
  mobile: string;
  gender: number | null;
  idCard: string;
  status: string;
  roomRequire: string;
  content: string;
  state: number;
  source: string;
  family: any;
}
