// 外出登记
export interface Goout {
  page: number;
  pageSize: number;
  name: string; //老人姓名
  accountId: number | null; //登记人iD
  state: number | null; //状态
  beginDate: string; //开始时间yyyy-MM-dd
  endDate: string; //结束时间yyyy-MM-dd
}
// 添加外出登记
export interface AddGoout {
  elderlyId: number | null; //老人Id
  startTime: string; //开始时间yyyy-MM-dd
  endTime: string; //结束时间yyyy-MM-dd
  mobile: string; //手机号联系方式
  address: string; //去处 地址
  content: string; //出去理由
  relation: string; //关系
  name: string; //老人姓名
}

// 院内活动
export interface playList {
  page: number;
  pageSize: number;
  name: string; //老人姓名
  beginDate: string; //开始时间yyyy-MM-dd
  endDate: string; //结束时间yyyy-MM-dd
  type: number | null; //分类ID
  key: string; //关键子
}

// 添加院内活动
interface Pictures {
  picture: string;
}
interface Elderly {
  elderlyId: number;
}
export interface AddplayList {
  id: number;
  title: string;
  type: number | null;
  content: string;
  elderly: Elderly[];
  pictures: Pictures[];
}
