// 出院列表
export interface dischargeListParams {
  page: number;
  pageSize: number;
  name: string;
  idCard: number | null;
  mobile: string;
  begId: number | null;
  state: string;
}
// 出院添加
export interface dischargeAddParams {
  id: number;
  elderlyId: number | undefined;
  expectDate: string;
  reason: string;
}
