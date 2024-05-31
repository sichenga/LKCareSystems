// 预定列表
export interface ReservationParams {
  page: number;
  pageSize: number;
  name: string;
  idCard: string;
  mobile: string;
  begId: number | null;
}
// 预定添加
interface files {
  file: string;
}

export interface ReservationAddParams {
  id: number;
  elderlyId: any;
  name: string;
  mobile: string;
  relation: string;
  begId: number | undefined;
  startDate: string;
  day: number | undefined;
  amount: number | undefined;
  files: Array<files>;
}
