// 账号设置

import { get, put } from "@/utils/request";
import type { RuleFormPwd } from "./SystemType";
// 获取用户信息 /api/account/getUserInfo
export const getUserInfo = () => {
  return get("/api/account/getUserInfo");
};
//修改头像 /api/account/updatePhoto
export const updatePhoto = (photo: string) => {
  return put("/api/account/updatePhoto", { photo });
};
//修改密码  /api/account/updatePwd
export const PutUpdatePwd = (data: RuleFormPwd) => {
  return put("/api/account/updatePwd", data);
};
