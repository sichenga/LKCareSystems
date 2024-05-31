//楼栋添加
export interface RuleForm {
  id: number;
  name: string;
  pid: number;
}

//护理服务列表 /api/nursingService/list
export interface NursingServiceList {
  page: number;
  pageSize: number;
}
//添加护理服务 /api/nursingService/add
export interface NursingServiceAdd {
  id: number;
  name: string;
  content: string;
}
// 房间类型列表
export interface Housetypeparams {
  page: number;
  pageSize: number;
}
// 房间类型添加
export interface Housetypeadd {
  id: number;
  name: string;
}

//楼栋添加
export interface RuleForm {
  id: number;
  name: string;
  pid: number;
}
//房间列表
export interface HouseViewType {
  page: number;
  pageSize: number;
  name: string;
  buildingId: number | undefined;
}
//添加房间 房间修改
export interface houseaddType {
  id: number;
  buildingId: number;
  type: number | null;
  name: string;
  beds: number | string;
  picture: string | null;
}
//获取房间类型
export interface getHouseType {
  page: number;
  pageSize: number;
}

//房间修改
export interface houseupdateType {
  id: number;
  buildingId: number;
  type: number;
  name: string;
  beds: number;
  picture: string;
}
// 床位列表 /api/beds/list
export interface BedsList {
  page: number;
  pageSize: number;
  houseId: number | null;
}
// 床位添加  /api/beds/add
export interface BedsAdd {
  id: number;
  houseId: number;
  name: string;
  price: number | undefined;
  state: number | undefined;
}

// 房间列表
export interface HouseList {
  id?: number;
  companyId?: number;
  name?: string;
  addTime?: string;
  addAccountId?: number;
  pid?: number;
}
