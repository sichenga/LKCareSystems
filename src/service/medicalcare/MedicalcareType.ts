//  体温记录列表
export interface MedicalcareParams {
  page: number;
  pageSize: number;
  name: string; //老人姓名
  beginDate: string; //开始时间yyyy-MM-dd
  endDate: string; //结束时间
  begId: string | null; //床位Id
}

// 添加
export interface Temperature {
  id: number;
  elderlyId: number | null;
  val: string;
}

// 查房记录列表 /api/checkRoom/list
export interface CheckRoomParams {
  /**
   * 床位ID
   */
  begId?: string;
  /**
   * 开始时间yyyy-MM-dd
   */
  beginDate?: string;
  /**
   * 结束时间yyyy-MM-dd
   */
  endDate?: string;
  /**
   * 老人姓名
   */
  name?: string;
  /**
   * 当前页
   */
  page?: number;
  /**
   * 每页显示多少条
   */
  pageSize?: number;
}

// 查房记录信息添加  /api/checkRoom/add
export interface CheckRoomAddParams {
  id?: number;
  elderlyId: number | null;
  spirit: string;
  diet: string;
  sleep: string;
  shit: string;
  urinate: string;
  communicate: string;
  memory: string;
  temperature: string;
  pulse: string;
  breathe: string;
  blood: string;
  suggest: string;
}

// 血压记录列表 /api/bloodPressure/list
export interface BloodPressureParams {
  /**
   * 床位ID
   */
  begId?: number | null;
  /**
   * 开始时间yyyy-MM-dd
   */
  beginDate?: string;
  /**
   * 结束时间yyyy-MM-dd
   */
  endDate?: string;
  /**
   * 老人姓名
   */
  name?: string;
  /**
   * 当前页
   */
  page?: number;
  /**
   * 每页显示多少条
   */
  pageSize?: number;
}

// 血压记录添加 /api/bloodPressure/add
export interface BloodPressureAddParams {
  id?: number | null;
  elderlyId: number | null;
  bloodPressure: string;
  pulse: string;
}
// 血糖记录列表
export interface bloodSugarlistParams {
  page: number;
  pageSize: number;
  name: string;
  beginDate: string; //开始时间yyyy-MM-dd
  endDate: string; //结束时间
  begId: number | null;
}
// // 存药登记列表 /api/drugs/list
export interface DrugsParams {
  /**
   * 床位ID
   */
  begId?: string;
  /**
   * 开始时间yyyy-MM-dd
   */
  beginDate?: string;
  /**
   * 结束时间yyyy-MM-dd
   */
  endDate?: string;
  /**
   * 老人姓名
   */
  name?: string;
  /**
   * 当前页
   */
  page?: number;
  /**
   * 每页显示多少条
   */
  pageSize?: number;
}
// 存药登记添加 /api/drugs/add
export interface DrugsAddParams {
  id: number | null;
  elderlyId: number | null;
  addTime: string;
  familyName: string;
  name?: string;
  counts?: number;
  unit?: number;
  expTime?: string;
  sum?: number;
  norms?: string;
  remarks?: string;
}
// 新增药品
export interface DrugsAddDrugsParams {
  id?: number;
  name: string;
  counts: number | null;
  unit: string;
  expTime: string;
  sum: number | null;
  norms: string;
  remarks: string;
}
// 用药计划添加 /api/drugPlan/add
interface Plans {
  time: string;
  content: string;
}
export interface DrugsPlanAddParams {
  drugId: number | null;
  startDate: string;
  plans: Array<Plans>;
}

// 停止用药 /api/drugPlan/updateEndDate
export interface DrugsPlanUpdateEndDateParams {
  id: number | null;
  endDate: string;
}
