import { resetRouter } from "@/router";
import { store } from "@/store";
import { adminLogin } from "@/service/admin/AdminApi";
import { LoginData } from "@/api/auth/model";
import { UserInfo } from "@/api/user/model";
import { TOKEN_KEY } from "@/enums/CacheEnum";
import { getList } from "@/service/role/RoleApi";

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<UserInfo>({
      roles: [],
      perms: [],
      model: {},
    });

    /**
     * 登录
     *
     * @returns
     * @param loginData
     */
    function login(loginData: LoginData) {
      return new Promise<void>((resolve, reject) => {
        adminLogin(loginData)
          .then((data: any) => {
            console.log(1111, data);
            if (data?.code === 10000) {
              ElMessage.success("登录成功");
            } else {
              ElMessage.error(data.msg ? data.msg : "登陆失败");
            }
            user.value.model = data.data.model;
            localStorage.setItem(TOKEN_KEY, data.data.token); // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
            resolve();
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    }

    // 获取信息(权限集合)
    function getUserInfo() {
      console.log("权限");
      return new Promise<UserInfo>((resolve, reject) => {
        getList()
          .then((data: any) => {
            console.log(11333, data);
            if (!data) {
              reject("Verification failed, please Login again.");
              return;
            }
            if (!data.data.list || data.data.list.length <= 0) {
              reject("getUserInfo: roles must be a non-null array!");
              return;
            }
            Object.assign(user.value.roles, { ...data?.data?.list });
            console.log(3333, user.value);
            resolve(data);
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    }

    // user logout
    function logout() {
      localStorage.setItem(TOKEN_KEY, "");
      location.reload(); // 清空路由
    }

    // remove token
    function resetToken() {
      console.log("resetToken");
      return new Promise<void>((resolve) => {
        localStorage.setItem(TOKEN_KEY, "");
        resetRouter();
        resolve();
      });
    }

    return {
      user,
      login,
      getUserInfo,
      logout,
      resetToken,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
