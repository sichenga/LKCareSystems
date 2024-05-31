import { post } from "@/utils/request";
// 上传图片
export const uploadImage = (file: File) => post("/api/upload/add", { file });
