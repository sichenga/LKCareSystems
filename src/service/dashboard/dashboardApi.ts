import { get } from "@/utils/request";
// 各城市机构数量统计 /api/count/getCompanyCount
export const getCompanyCount = () => get("/api/count/getCompanyCount");
// 各省份老人你数量统计 /api/count/getElderlyCount
export const getElderlyCount = () => get("/api/count/getElderlyCount");
// 机构、老人、床位数量统计 /api/count/list
export const getCountList = () => get("/api/count/list");
// 各年龄段数量统计 /api/count/getAgeGroup
export const getAgeGroup = () => get("/api/count/getAgeGroup");
// 最近12个月入院数量统计 /api/count/getOrderCount
export const getageGroup = () => get("/api/count/getOrderCount");
// 最近12个月出院数量统计 /api/count/getDisCount
export const getDisCount = () => get("/api/count/getDisCount");
// 最近12个月预定数量统计 /api/count/getResCount
export const getResCount = () => get("/api/count/getResCount");
