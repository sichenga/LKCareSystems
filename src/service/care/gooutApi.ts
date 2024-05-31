import { get, post, put, del } from "@/utils/request";
import type {
  Goout,
  AddGoout,
  playList,
  AddplayList,
} from "@/service/care/gooutType";
// 外出登记 列表
export const getList = (data: Goout) => {
  return get("/api/goOut/list", data);
};

// 删除外出登记 列表
export const DelgetList = (id: number) => {
  return del("/api/goOut/delete/" + id);
};
// 外出登记单挑 列表
export const goOutList = (id: number) => {
  return get("/api/goOut/get/" + id);
};

// 添加外出登记 列表
export const AddGooutList = (params: AddGoout) => {
  return post("/api/goOut/add", params);
};

// 修改外出登记 列表
export const UpdateGoout = (params: AddGoout) => {
  return put("/api/goOut/update", params);
};

//院内活动列表 /api/play/list
export const getPlayList = (data: playList) => {
  return get("/api/play/list", data);
};
// 活动分类 /api/playType/list
export const getPlayTypeList = () => {
  return get("/api/playType/list");
};
//删除院内活动列表 /api/play/list
export const getDeleteList = (id: number) => {
  return del("/api/play/delete/" + id);
};
// 添加院内活动列表
export const AddPlayAdd = (params: AddplayList) => {
  return post("/api/play/add", params);
};
//获取单挑院内活动
export const PlayList = (id: number) => {
  return get("/api/play/get/" + id);
};
