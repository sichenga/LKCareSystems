<template>
  <el-container>
    <el-header>
      <el-image :src="logo" style="width: 300px; height: 70px" />
    </el-header>
    <el-main>
      <el-card class="card">
        <el-image :src="loginback" style="width: 70%; height: 100%" />
        <div class="right">
          <div class="title">
            <span>账号登录</span>
            <el-image
              :src="code"
              class="code"
              style="width: 100px; height: 100px"
            />
          </div>
          <el-form
            ref="loginFormRef"
            :model="loginData"
            :rules="loginRules"
            class="demo-ruleForm"
            status-icon
          >
            <el-form-item prop="username">
              <!--账号-->
              <el-input v-model="loginData.username" placeholder="请输入账号">
                <template #prefix>
                  <el-icon>
                    <User />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <!--密码-->
            <el-form-item prop="pwd">
              <el-input
                v-model="loginData.pwd"
                placeholder="请输入密码"
                show-password
              >
                <template #prefix>
                  <el-icon>
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item class="btn">
              <span>忘记密码?</span>
            </el-form-item>
            <el-form-item>
              <el-button
                style="width: 100%; height: 45px"
                type="success"
                @click="handleLogin"
                >登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-main>
    <el-footer>
      <span>Copyright @ 乐康养老 京ICP备15048223号-1</span>
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/store";

import type { FormInstance } from "element-plus";
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import router from "@/router";
// import {ThemeEnum} from "@/enums/ThemeEnum";
import { logo, loginback, code } from "@/utils/images";
import { Lock } from "@element-plus/icons-vue";
// Stores
const userStore = useUserStore();
// const settingsStore = useSettingsStore();
// Internationalization
const { t } = useI18n();
// Reactive states
const icpVisible = ref(true);
const loading = ref(false); // 按钮loading
// const isCapslock = ref(false); // 是否大写锁定
const loginFormRef = ref<FormInstance>(); // 登录表单ref
const { height } = useWindowSize();
const loginData = ref<any>({
  username: "admin",
  pwd: "admin",
});
console.log(import.meta.env.VITE_APP_API_URL);
const loginRules = computed(() => {
  return {
    username: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.username.required"),
      },
    ],
    pwd: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.password.required"),
      },
    ],
    //   captchaCode: [
    //     {
    //       required: true,
    //       trigger: "blur",
    //       message: t("login.message.captchaCode.required"),
    //     },
    //   ],
  };
});

/** 获取验证码 */
// function getCaptcha() {
//   AuthAPI.getCaptcha().then((data) => {
//     loginData.value.captchaKey = data.captchaKey;
//     captchaBase64.value = data.captchaBase64;
//   });
// }

/** 登录 */
const route = useRoute();

function handleLogin() {
  console.log(2222);
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(() => {
          const query: LocationQuery = route.query;
          const redirect = (query.redirect as LocationQueryValue) ?? "/";
          const otherQueryParams = Object.keys(query).reduce(
            (acc: any, cur: string) => {
              if (cur !== "redirect") {
                acc[cur] = query[cur];
              }
              return acc;
            },
            {}
          );

          router.push({ path: redirect, query: otherQueryParams });
        })
        // .catch(() => {
        //   getCaptcha();
        // })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}

/** 主题切换 */
// const toggleTheme = () => {
//   const newTheme =
//     settingsStore.theme === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
//   settingsStore.changeTheme(newTheme);
// };

/** 根据屏幕宽度切换设备模式 */
watchEffect(() => {
  icpVisible.value = height.value >= 600;
});

/** 检查输入大小写 */
// function checkCapslock(event: KeyboardEvent) {
//   // 防止浏览器密码自动填充时报错
//   if (event instanceof KeyboardEvent) {
//     isCapslock.value = event.getModifierState("CapsLock");
//   }
// }

// onMounted(() => {
//   // getCaptcha();
// });
</script>

<style lang="less" scoped>
.el-container {
  width: 100%;
  height: 100%;
}

.el-header {
  height: 100px;
  display: flex;
  align-items: center;
}

.el-main {
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eeeeee;

  .card {
    width: 80%;
    height: 550px;

    :deep(.el-card__body) {
      width: 100%;
      height: 100%;
      padding: 0 !important;
      display: flex;
      align-items: center;
    }

    .right {
      width: 30%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .el-form {
        width: 80%;

        .el-input {
          height: 45px;
        }
      }

      .title {
        width: 100%;
        height: 100px;
        line-height: 100px;
        text-align: center;
        position: relative;
        margin-bottom: 20px;

        .code {
          position: absolute;
          right: 5px;
          top: 5px;
        }

        span {
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }
}

.el-footer {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}

.btn {
  :deep(.el-form-item__content) {
    width: 100%;
    flex-direction: row-reverse;

    span {
      // 变小手
      cursor: pointer;
      color: #409eff;
    }
  }
}
</style>
