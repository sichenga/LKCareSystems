import { get, post, del } from "@/utils/request";
import type { PatrolList, PatrolAdd } from "./PatrolType";
// 夜巡列表 /api/patrol/list
export const patrolList = (params: PatrolList) =>
  get("/api/patrol/list", params);
// 夜巡添加 /api/patrol/add
export const patrolAdd = (params: PatrolAdd) => post("/api/patrol/add", params);
// 夜巡删除 /api/patrol/delete/10
export const patrolDelete = (id: number) => del(`/api/patrol/delete/${id}`);
// 根据id查询单条夜巡数据
export const patrolInfo = (id: number) => get(`/api/patrol/info/${id}`);
