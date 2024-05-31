import { post } from "@/utils/request";
import type { Login } from "./AdminType";
// 用户登录 /api/auth/login
const adminLogin = (data: Login) => post("/api/auth/login", data);

export { adminLogin };
