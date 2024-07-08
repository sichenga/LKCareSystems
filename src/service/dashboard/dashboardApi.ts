import { get } from "@/utils/request";
// 各城市机构数量统计 /api/count/getCompanyCount
export const getCompanyCount = () => get("/api/count/getCompanyCount");
// 各省份老人你数量统计 /api/count/getElderlyCount
export const getElderlyCount = () => get("/api/count/getElderlyCount");
// 机构、老人、床位数量统计 /api/count/list
export const getCountList = () => get("/api/count/list");
