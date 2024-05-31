// 老人管理
import { get, post, put, del } from "@/utils/request";
import type { AddElderlyRequest, ListElderlyRequest } from "./OldType";
// 删除老人  /api/elderly/delete/1
export const deleteElderly = (id: number) => del(`/api/elderly/delete/${id}`);
// 老人添加  /api/elderly/add
export const addElderly = (data: AddElderlyRequest) =>
  post("/api/elderly/add", data);
// 老人列表 /api/elderly/list
export const getElderlyList = (params?: ListElderlyRequest) =>
  get("/api/elderly/list", params);
// 所有自理类目 /api/selfcare/list
export const getSelfcareList = () => get("/api/selfcare/list");
// 所有疾病类目 /api/disease/list
export const getDiseaseList = () => get("/api/disease/list");
// 所有体检项目 /api/checkupitems/list
export const getCheckupItemsList = () => get("/api/checkupitems/list");
// 所有档案文件项目 /api/fileitems/list
export const getFileItemsList = () => get("/api/fileitems/list");
// 老人修改 /api/elderly/update
export const updateElderly = (data: AddElderlyRequest) =>
  put("/api/elderly/update", data);
// 获取单条老人信息 /api/elderly/get/20
export const getElderly = (id: number) => get(`/api/elderly/get/${id}`);
