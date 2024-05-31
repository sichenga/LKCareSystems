import { get, post, put, del } from "@/utils/request";
import type {
  MedicalcareParams,
  Temperature,
  CheckRoomParams,
  CheckRoomAddParams,
  BloodPressureParams,
  BloodPressureAddParams,
  bloodSugarlistParams,
  DrugsParams,
  DrugsAddParams,
  DrugsPlanAddParams,
  DrugsPlanUpdateEndDateParams,
} from "@/service/medicalcare/MedicalcareType";

// 体温记录列表
export const TemperatureList = (params?: MedicalcareParams) => {
  return get("/api/temperature/list", params || {});
};

// 添加体温记录
export const TemperatureAdd = (data?: Temperature) => {
  return post("/api/temperature/add", data || {});
};

// 查房记录列表 /api/checkRoom/list
export const CheckRoomList = (params?: CheckRoomParams) =>
  get("/api/checkRoom/list", params || {});

// 获取单条查房记录信息 /api/checkRoom/get/3
export const CheckRoomGet = (id: number) => get(`/api/checkRoom/get/${id}`);

// 删除查房记录信息 /api/checkRoom/delete/2
export const CheckRoomDelete = (id: number) =>
  del(`/api/checkRoom/delete/${id}`);

// 查房记录信息添加  /api/checkRoom/add
export const CheckRoomAdd = (data?: CheckRoomAddParams) =>
  post("/api/checkRoom/add", data || {});

// 查房记录信息修改 /api/checkRoom/update
export const CheckRoomUpdate = (data?: CheckRoomAddParams) =>
  put("/api/checkRoom/update", data || {});

// 血压记录列表 /api/bloodPressure/list
export const BloodPressureList = (params?: BloodPressureParams) =>
  get("/api/bloodPressure/list", params || {});
// 获取单条血压记录信息 /api/bloodPressure/get/1
export const BloodPressureGet = (id: number) =>
  get(`/api/bloodPressure/get/${id}`);
// 删除血压记录信息 /api/bloodPressure/delete/2
export const BloodPressureDelete = (id: number) =>
  del(`/api/bloodPressure/delete/${id}`);
// 血压记录添加 /api/bloodPressure/add
export const BloodPressureAdd = (data?: BloodPressureAddParams) =>
  post("/api/bloodPressure/add", data || {});
// 血压记录修改 /api/bloodPressure/update
export const BloodPressureUpdate = (data?: BloodPressureAddParams) =>
  put("/api/bloodPressure/update", data || {});
// 添加体温记录
export const TemperatureDelete = (id?: number) => {
  return del("/api/temperature/delete/" + id);
};
// 单挑体温
export const GetTemperature = (id?: number) => {
  return get("/api/temperature/get/" + id);
};
// 修改体温记录
export const TemperatureUpdate = (data?: Temperature) => {
  return put("/api/temperature/update", data || {});
};

// 血糖记录列表
export const BloodSugarList = (params: bloodSugarlistParams) => {
  return get("/api/bloodSugar/list", params);
};
// 血糖记录添加
export const BloodSugarAdd = (data: Temperature) => {
  return post("/api/bloodSugar/add", data);
};

// 删除血糖记录信息
export const BloodSugarDelete = (id: number) => {
  return del(`/api/bloodSugar/delete/${id}`);
};
// 获取单条血糖记录信息
export const BloodSugarGet = (id: number) => {
  return get(`/api/bloodSugar/get/${id}`);
};

// 血糖记录修改
export const BloodSugarUpdate = (data: Temperature) => {
  return put("/api/bloodSugar/update", data);
};
// 存药登记列表 /api/drugs/list
export const DrugsList = (params?: DrugsParams) =>
  get("/api/drugs/list", params || {});
// 获取老人存药记录 /api/drugs/listForElderly/25
export const DrugsListForElderly = (id: number) =>
  get(`/api/drugs/listForElderly/${id}`);
// 获取单条存药登记信息 /api/drugs/get/3
export const DrugsGet = (id: number) => get(`/api/drugs/get/${id}`);
// 删除存药登记信息 /api/drugs/delete/2
export const DrugsDelete = (id: number) => del(`/api/drugs/delete/${id}`);
// 存药登记添加 /api/drugs/add
export const DrugsAdd = (data: DrugsAddParams) =>
  post("/api/drugs/add", data || {});
// 存药登记信息修改 /api/drugs/update
export const DrugsUpdate = (data: DrugsAddParams) =>
  put("/api/drugs/update", data || {});
// 用药计划添加 /api/drugPlan/add
export const DrugPlanAdd = (data: DrugsPlanAddParams) =>
  post("/api/drugPlan/add", data || {});
// 获取老人用药计划列表 /api/drugs/listForPlan/25
export const DrugsListForPlan = (id: number) =>
  get(`/api/drugs/listForPlan/${id}`);
// 停止用药 /api/drugPlan/updateEndDate
export const DrugPlanUpdateEndDate = (data: DrugsPlanUpdateEndDateParams) =>
  put("/api/drugPlan/updateEndDate", data || {});
// 根据药品ID获取用药计划 /api/drugPlan/get/20
export const DrugPlanGet = (id: number) => get(`/api/drugPlan/get/${id}`);
