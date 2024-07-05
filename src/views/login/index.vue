<template>
  <div class="container">
    <div class="header">
      <img
        src="../../assets/images/logo.png"
        style="width: 300px; height: 100%"
      />
      <img src="" alt="" />
    </div>
    <div class="main">
      <div class="card">
        <img
          src="../../assets//images/index.jpg"
          style="width: 70%; height: 100%"
        />
        <div class="right">
          <div class="title">
            <span>账号登录</span>
            <img
              src="../../assets/images/qrCode.png"
              class="code"
              fit="cover"
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
            <el-form-item prop="verifyCode" class="code">
              <!--验证码-->
              <el-input
                v-model="loginData.verifyCode"
                placeholder="请输入验证码"
              >
                <template #prefix>
                  <el-icon>
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
              <el-image
                style="width: 45%; height: 50px"
                :src="codeData"
                loading="eager"
                v-loading="apperStore.isLoading"
                @click="getCaptcha"
              />
            </el-form-item>
            <el-form-item class="btn">
              <span>忘记密码?</span>
            </el-form-item>
            <el-form-item>
              <el-button
                style="width: 100%; height: 45px"
                type="success"
                @click="login"
                >登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="footer">
      <span>Copyright @ 乐康养老 京ICP备15048223号-1</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/store";
import { debounce } from "lodash-es";
import type { FormInstance } from "element-plus";
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import router from "@/router";
import { Lock, User } from "@element-plus/icons-vue";
import { getCode } from "@/service/admin/AdminApi";
import { useApperStore } from "@/store";

// import {ThemeEnum} from "@/enums/ThemeEnum";
// Stores
const userStore = useUserStore();
// 获取Loading效果
const apperStore = useApperStore();
// const settingsStore = useSettingsStore();
// Internationalization
const { t } = useI18n();
// Reactive states
const icpVisible = ref(true);
const loading = ref(false); // 按钮loading
// const isCapslock = ref(false); // 是否大写锁定
const loginFormRef = ref<FormInstance>(); // 登录表单ref
const { height } = useWindowSize();
const codeData = ref(""); //验证码
const loginData = ref<any>({
  username: "",
  pwd: "",
  verifyCode: "",
  verifyCodeId: "",
});

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
    verifyCode: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.captchaCode.required"),
      },
    ],
  };
});

/** 获取验证码 */
async function getCaptcha() {
  const res: any = await getCode();
  // console.log(1111, res);
  if (res?.code === 10000) {
    loginData.value.verifyCodeId = res.id;
    codeData.value = res.imageCode;
  }
}

/** 登录 */
const route = useRoute();

const login = debounce(handleLogin, 300);

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

onMounted(() => {
  getCaptcha();
});
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  align-items: center;
}

.header {
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  box-sizing: border-box;
}

.main {
  width: 100%;
  background-color: #eeeeee1a;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 15px 9px #e7e6e6;
}

.card {
  width: 1280px;
  height: 473px;
  display: flex;
  box-shadow: 0 0 20px 10px #ccc;

  //
  .right {
    width: 461px;
    height: 473px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    padding-bottom: 110px;
    box-sizing: border-box;

    .el-form {
      width: 80%;
      height: 100%;
      box-sizing: border-box;
      margin-top: 3%;
      .el-input {
        height: 50px;
      }
      .el-form-item {
        margin-bottom: 20px;
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

//
.footer {
  width: 100%;
  height: 10%;
  text-align: center;
  // line-height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

//
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
.code {
  :deep(.el-form-item__content) {
    display: flex;
    justify-content: space-between;
    .el-input {
      width: 45%;
    }
  }
  .el-image {
    // 变小手
    cursor: pointer;
  }
}
</style>
