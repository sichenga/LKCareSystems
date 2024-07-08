import router, { resetRouter } from "@/router";
import { store } from "@/store";
import { adminLogin } from "@/service/admin/AdminApi";
import { TOKEN_KEY } from "@/enums/CacheEnum";
import { getList } from "@/service/role/RoleApi";

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<any>({
      roles: [],
      perms: [],
      model: {},
    });

    //选择食材数据
    const ingredient = ref([]);
    const ingredients = (val: any) => {
      ingredient.value = val;
    };

    // 选择食材保存在缓存中
    const Saveingredients = ref<any>([]);

    const SetSaveingredients = (val: any) => {
      console.log(88888, val);

      Saveingredients.value = val;
    };
    /**
     * 登录
     *
     * @returns
     * @param loginData
     */
    function login(loginData: any) {
      return new Promise<void>((resolve, reject) => {
        adminLogin(loginData)
          .then((data: any) => {
            console.log(1111, data);
            if (data?.code === 10000) {
              ElMessage.success("登录成功");
            } else {
              ElMessage.error(data.msg ? data.msg : "登陆失败");
              reject(data?.code);
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
      return new Promise<any>((resolve, reject) => {
        getList()
          .then((data: any) => {
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
      location.reload();
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
      ingredient,
      getUserInfo,
      logout,
      resetToken,
      ingredients,
      Saveingredients,
      SetSaveingredients,
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
