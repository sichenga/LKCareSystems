import { get, post, del, put } from "@/utils/request";
import type {
  market,
  Addmarket,
  followup,
  AddFollowup,
  order,
  orderAdds,
} from "@/service/market/marketType";
//资讯列表
export const getMarketList = (params: market) => {
  return get("/api/question/list", params);
};
//删除资讯
export const deleteMarket = (id: number) => {
  return del("/api/question/delete/" + id);
};

//批删咨询
export const deleteAll = (ids: Addmarket) => {
  return post("/api/question/deleteAll", ids);
};

//批删咨询
export const questionAll = (data: Addmarket) => {
  return post("/api/question/add", data);
};

//获取单挑咨询
export const getquestionlist = (id: number) => {
  return get("/api/question/get/" + id);
};

//获取单挑咨询
export const questionUpdate = (data: Addmarket) => {
  return put("/api/question/update", data);
};

//咨询登记列表
export const followupList = (data: followup) => {
  return get("/api/followup/list", data);
};
//删除回访信息
export const followupdelete = (id: number) => {
  return del("/api/followup/delete/" + id);
};

//回访记录添加
export const followupAdd = (data: AddFollowup) => {
  return post("/api/followup/add", data);
};
//修改信息回访
export const followupupdate = (data: AddFollowup) => {
  return put("/api/followup/update", data);
};

//入院列表
export const orderList = (params: order) => {
  return get("/api/order/list", params);
};

//删除入院
export const orderDelete = (id: number) => {
  return del("/api/order/delete/" + id);
};
//批删入院
export const questionAdd = (ids: any) => {
  return post("/api/order/deleteAll", ids);
};

//添加入院
export const orderAdd = (data: orderAdds) => {
  return post("/api/order/add", data);
};

//根据id获取老人单挑数据
export const orderGet = (id: number) => {
  return get("/api/order/get/" + id);
};

//修改入院老人

export const orderupdate = (data: any) => {
  return put("/api/order/update", data);
};
