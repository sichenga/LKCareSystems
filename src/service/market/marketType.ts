//咨询列表
export interface market {
  page: number;
  pageSize: number;
  name?: string;
  customerName?: string;
  mobile?: string;
  state?: number | null; //0:待回访,1:已回访
  customerId?: number | null;
}
// 添加咨询
export interface Addmarket {
  customerId: number | null;
  type: string;
  source: string;
  name: string;
  mobile: string;
  relation: string;
  visitTime: string;
  content: string;
}
//咨询登记列表
export interface followup {
  page: number;
  pageSize: number;
  questionId?: number | null;
}
//添加咨询登记
export interface AddFollowup {
  questionId?: number | null;
  callbackTime: string;
  content: string;
}

// 入院列表
export interface order {
  page: number;
  pageSize: number;
  name?: string; //老人姓名
  mobile?: string; //手机号
  idCard?: string; //身份证号
  begId?: number | null; //床位号
  state?: number | null; //状态
}

//入院添加
export interface orderAdds {
  elderlyId: number | null; //护理Id
  begId: number | null; //床位ID
  begPrice?: number | null; //床位单价
  days?: number | null; //入住天数
  startDate: string; //入住日期
  foodPrice?: number | null; // 套餐单价
  servicePrice?: number | null; //护理费
  cashPledge?: number | null; //押金
  livingPrice?: number | null; // 一次性生活费
  payDays?: number | null; //入院费用核定天数  分几期付款
  state: number | null; // 保存暂不提交 0  保存并提交1
  services: number[];
  files: string[]; //合同协议
}
