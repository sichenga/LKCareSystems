<template>
  <!-- 账号设置 -->
  <div class="app-container">
    <el-card style="max-width: 100%">
      <div class="headbox">
        <el-form-item class="title" label="头像">
          <div class="header">
            <div>
              <img :src="Image + img" alt="" />
            </div>
            <div class="image-title">
              <UploadImg
                :showlist="false"
                :text="'更换头像'"
                :texts="true"
                @upload="Imgupload"
              />
            </div>
          </div>
        </el-form-item>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        class="demo-ruleForm"
        label-width="auto"
        status-icon
        style="width: 300px"
      >
        <el-form-item label="姓名">
          <el-input v-model="ruleForm.name" class="custom-input" disabled />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="ruleForm.mobile" class="custom-input" disabled />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="ruleForm.username" class="custom-input" disabled />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="ruleForm.pwd" class="custom-pass" disabled />
          <span
            style="padding-left: 20px; font-size: 12px; color: #75a5ea"
            @click="isdialog = true"
            >修改密码</span
          >
          <PassDialog v-if="isdialog" @close="close" />
        </el-form-item>
        <el-form-item label="所属角色">
          <el-input v-model="ruleForm.roleIds" class="custom-input" disabled />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import PassDialog from "@/components/dialog/config/PassDialog.vue";
import type { RuleForm } from "@/service/system/SystemType";
import { getUserInfo, updatePhoto } from "@/service/system/SystemApi";
import UploadImg from "@/components/upload/UploadImg.vue";
import { useUserStore } from "@/store";

const userStore = useUserStore();
const Image = import.meta.env.VITE_BASE_URL + "/";

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "",
  mobile: "",
  username: "",
  pwd: "",
  roleIds: "",
});

//弹出框
const isdialog = ref(false);
const close = (val: any) => {
  isdialog.value = val;
  if (val == true) {
    isdialog.value = false;
    getList();
  }
};
const img = ref("");
const getList = async () => {
  let res: any = await getUserInfo().catch(() => {});
  console.log(res);
  if (res?.code == 10000) {
    img.value = res.data.photo;
    Object.assign(ruleForm, res.data);
  }
};
//更改头像
const Imgupload = async (val: any) => {
  if (val) {
    let res: any = await updatePhoto(val);
    if (res?.code == 10000) {
      getList();
      userStore.user.model!.photo = val;
      ElMessage.success("更改头像成功");
    }
  }
};

onMounted(async () => {
  await getList(); //获取登录用户信息
});
</script>

<style lang="less" scoped>
.headbox {
  width: 300px;
  height: 50px;
  display: flex;
  margin-top: 30px;
  .header {
    width: 50px;
    height: 50px;
    margin-left: 20px;
    border-radius: 50%;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .replece {
    color: #75a5ea;
    line-height: 50px;
    font-size: 12px;
    padding-left: 30px;
  }
}

.el-form {
  margin-top: 20px !important;
  margin-bottom: 20px !important;
}

.custom-inputtel {
  margin-left: 10px;
}

.custom-input {
  margin-left: 25px;
}

.custom-pass {
  width: 100px !important;
  margin-left: 25px;
}

.title {
  position: relative;
  margin-left: 30px;
}

.image-title {
  position: absolute;
  top: 10px;
  left: 80px;
}
</style>
