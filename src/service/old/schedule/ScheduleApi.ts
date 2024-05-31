import { get, post, del } from "@/utils/request";

// 获取老人排班列表 /api/schedule/list/20
export const getScheduleList = (id: number) => get(`/api/schedule/list/${id}`);
// 删除排班信息  /api/schedule/delete/1
export const deleteSchedule = (id: number) => del(`/api/schedule/delete/${id}`);
// 老人排班添加 /api/schedule/add
export const addSchedule = (data: any) => post("/api/schedule/add", data);
