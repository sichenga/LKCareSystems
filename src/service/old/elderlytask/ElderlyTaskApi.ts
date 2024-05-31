import { get, post, del } from "@/utils/request";
import type { AddElderlyTaskDto } from "./ElderlyTaskType";
// 获取老人任务列表  /api/elderlyTask/getTask/20
export const elderlyTaskgetTask = (id: number) =>
  get(`/api/elderlyTask/getTask/${id}`);
// 删除任务信息 /api/elderlyTask/delete/1
export const elderlyTaskdelete = (id: number) =>
  del(`/api/elderlyTask/delete/${id}`);
// 老人任务添加 /api/elderlyTask/add
export const elderlyTaskadd = (data: AddElderlyTaskDto) =>
  post("/api/elderlyTask/add", data);
