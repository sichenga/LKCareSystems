import { get, post, del, put } from "@/utils/request";
import type {
  NursingServiceList,
  Housetypeparams,
  Housetypeadd,
  RuleForm,
  HouseViewType,
  houseaddType,
  getHouseType,
  NursingServiceAdd,
  BedsList,
  BedsAdd,
} from "./ConfigType";

// 房间类型列表
export const HousetypeList = (params: Housetypeparams) => {
  return get("/api/housetype/list", params);
};

// 房间类型添加
export const HousetypeAdd = (params: Housetypeadd) => {
  return post("/api/housetype/add", params);
};

// 删除房间类型
export const HousetypeDelete = (id: number) => {
  return del(`/api/housetype/delete/${id}`);
};
// 批量删除房间类型
export const HousetypeDeleteBatch = (data: number[]) => {
  return post("/api/housetype/deleteAll", data);
};

// 房间类型修改
export const Housetypeupdate = (data: Housetypeadd) => {
  return put(`/api/housetype/update`, data);
};

// 楼栋管理
export const ConfigBuildingList = () => get("/api/building/list");

//添加楼栋
export const BuildingAdd = (data: RuleForm) => post("/api/building/add", data);

//修改楼栋
export const Buildingupdate = (data: RuleForm) =>
  put("/api/building/update", data);

//删除楼栋
export const delBuilding = (id: number) => del("/api/building/delete/" + id);

//护理服务列表 /api/nursingService/list
export const ConfigNursingServiceList = (params?: NursingServiceList) =>
  get("/api/nursingService/list", params);

//删除护理服务  /api/nursingService/delete/5
export const delNursingService = (id: number) =>
  del("/api/nursingService/delete/" + id);
// 批量删除护理服务
export const delNursingServiceBatch = (data: number[]) =>
  post("/api/nursingService/deleteAll", data);
//添加护理服务 /api/nursingService/add
export const addNursingService = (data: NursingServiceAdd) =>
  post("/api/nursingService/add", data);

// 护理服务修改 /api/nursingService/update
export const updateNursingService = (data: NursingServiceAdd) =>
  put("/api/nursingService/update", data);

//房间列表
export const getHouseList = (data?: HouseViewType) =>
  get("/api/house/list", data || {});

//房间删除
export const deleteHouse = (id: number) => del(`/api/house/delete/${id}`);
// 批量删除房间
export const deleteHouseBatch = (data: number[]) =>
  post("/api/house/deleteAll", data);
//添加房间
export const addHouse = (params: houseaddType) =>
  post("/api/house/add", params);

//获取房间类型列表
export const HouseTypeList = (data: getHouseType) =>
  get("/api/housetype/list", data);

// 获取楼栋列表
export const buildingList = () => get("/api/building/list");

//房间修改
export const houseupdate = (data: houseaddType) =>
  put("/api/house/update", data);

// 床位列表 /api/beds/list
export const getBedsList = (params?: BedsList) => get("/api/beds/list", params);

// 删除床位 /api/beds/delete/2
export const delBeds = (id: number) => del("/api/beds/delete/" + id);

//批量删除床位
export const delBedsBatch = (data: number[]) =>
  post("/api/beds/deleteAll", data);

// 床位添加  /api/beds/add
export const addBeds = (data: BedsAdd) => post("/api/beds/add", data);

// 床位修改 /api/beds/update
export const updateBeds = (data: BedsAdd) => put("/api/beds/update", data);
