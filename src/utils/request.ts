import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
// 引入pinia userStore模块
import { useUserStore, useApperStore } from "@/store";
// 引入element-plus
import { ElMessage } from "element-plus";
// 令牌
import { TOKEN_KEY } from "@/enums/CacheEnum";
interface McAxiosRequestConfig extends AxiosRequestConfig {
  extraConfig?: {
    tokenRetryCount: number; // 标记当前请求的csrf token重试次数
  };
}

const timeout = 60000; // 请求超时时间和延迟请求超时时间统一设置
const config: McAxiosRequestConfig = {
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout,
  headers: {
    "Content-Type": "application/json",
  },
};
const instance = axios.create(config);
// 请求拦截器
instance.interceptors.request.use(async (config: any) => {
  const userStore = useUserStore();
  const userAppStore = useApperStore();
  if (!config.extraConfig?.tokenRetryCount) {
    config.extraConfig = {
      tokenRetryCount: 0,
    };
  }
  (config.headers as any)["Authorization"] =
    localStorage.getItem(TOKEN_KEY) || "";
  if (config.url === "/api/upload/add") {
    (config.headers as any)["Content-Type"] = "multipart/form-data";
  }
  userAppStore.isLoading = true;
  return config;
});
// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const userAppStore = useApperStore();
    userAppStore.isLoading = false;
    return response.data;
  },
  async (err: any) => {
    const userAppStore = useApperStore();
    if (axios.isCancel(err)) {
      // 取消的请求，不报错
      return;
    }

    if (err.message === "Network Error") {
      console.log("Network Error");
      ElMessage.error("网络异常");
      return;
    }
    if (err.message.includes("timeout")) {
      return;
    }
    if (err.response?.status >= 500) {
      return;
    }

    const { data: responseData } = err.response || {};
    const { status } = responseData || {};
    if (status) {
      switch (parseInt(status)) {
        case 4001:
          break;
        default:
          break;
      }
    }
    console.log(11111, (userAppStore.isLoading = false));
    userAppStore.isLoading = false;
    return err.response;
  }
);

const get = (url: string, params?: any): Promise<AxiosResponse<any>> => {
  return instance.get(url, { params });
};
const post = (
  url: string,
  data?: any,
  config?: any
): Promise<AxiosResponse<any>> => {
  return instance.post(url, data, config);
};
const del = (url: string, params?: any): Promise<AxiosResponse<any>> => {
  return instance.delete(url, { params });
};
const put = (url: string, data?: any): Promise<AxiosResponse<any>> => {
  return instance.put(url, data);
};

export { get, post, del, put };
