interface Health {
  oldillness: any;
  nowillness: any;
  otherillness: string | Array<string>;
  otherCase: string | Array<string>;
}

interface SelfCaresItem {
  name: string;
  val: string;
}

interface CheckupsItem {
  name: string;
  picture: string;
}
// 添加家属信息
export interface FamilyItem {
  id?: number;
  name: string;
  mobile: string;
  idCard: string;
  relation: string;
  gender: number | undefined;
  address: string;
}

// 老人添加  /api/elderly/add
export interface AddElderlyRequest {
  id?: number | undefined;
  name: string;
  mobile: string;
  photo: string;
  gender: number;
  birthday: string;
  nativePlace: string;
  nation: string;
  idCard: string;
  politics: string;
  socialCard: string;
  marriage: undefined;
  eduLevel: undefined;
  education: undefined;
  resident: undefined;
  address: undefined;
  begId: number | undefined;
  state: number | undefined;
  health: Health;
  selfCares: Array<SelfCaresItem>;
  checkups: Array<CheckupsItem>;
  family: Array<FamilyItem>;
}

// 老人列表 /api/elderly/list
export interface ListElderlyRequest {
  page: number;
  pageSize: number;
  name: string;
  idCard: number | undefined | string;
  begId: number | undefined;
  state: number | undefined;
}
// 老人信息
export interface ElderlyItem {
  name: string;
  idCard: string;
  begName: string;
  photo: string;
}
