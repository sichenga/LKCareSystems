import { get, post, put, del } from "@/utils/request";
import type { ClothesListparams, ClothesAddParams } from "./ClothesType";

// 错衣缺衣列表
export const clothesList = (params: ClothesListparams) => {
  return get("/api/clothes/list", params);
};

// 获取单条错衣缺衣信息
export const clothesget = (id: number) => {
  return get(`/api/clothes/get/${id}`);
};

// 错衣缺衣信息添加
export const clothesAdd = (data: ClothesAddParams) => {
  return post("/api/clothes/add", data);
};

// 错衣缺衣信息修改
export const clothesUpdate = (data: ClothesAddParams) => {
  return put("/api/clothes/update", data);
};

// 删除错衣缺衣信息
export const clothesDelete = (id: number) => {
  return del(`/api/clothes/delete/${id}`);
};
// 批量删除错衣缺衣信息
export const clothesDeleteAll = (ids: any) => {
  return post("/api/clothes/deleteAll", ids);
};
