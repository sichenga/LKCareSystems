<template>
  <!-- 账号设置 -->
  <el-card style="max-width: 100%">
    <div class="headbox">
      <el-form-item label="头像" class="title">
        <div class="header">
          <div>
            <img :src="Image + img" alt="" />
          </div>
          <div class="image-title">
            <UploadImg
              :texts="true"
              @upload="Imgupload"
              :showlist="false"
              :text="'更换头像'"
            />
          </div>
        </div>
      </el-form-item>
    </div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      label-width="auto"
      class="demo-ruleForm"
      style="width: 300px"
      status-icon
    >
      <el-form-item label="姓名">
        <el-input class="custom-input" v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input class="custom-input" v-model="ruleForm.mobile" />
      </el-form-item>
      <el-form-item label="账号">
        <el-input class="custom-input" v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input class="custom-pass" v-model="ruleForm.pwd" />
        <span
          style=" padding-left: 20px; font-size: 12px;color: #75a5ea"
          @click="isdialog = true"
          >修改密码</span
        >
        <PassDialog @close="close" v-if="isdialog" />
      </el-form-item>
      <el-form-item label="所属角色">
        <el-input class="custom-input" v-model="ruleForm.roleIds" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import type { ComponentSize, FormInstance } from "element-plus";
import PassDialog from "@/components/dialog/config/PassDialog.vue";
import type { RuleForm } from "@/service/system/SystemType";
import { getUserInfo, updatePhoto } from "@/service/system/SystemApi";
import UploadImg from "@/components/upload/UploadImg.vue";
import { ElMessage } from "element-plus";
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
  console.log(1111, val);

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
  margin-left: 30px;
}

.image-title {
  margin-top: -55px;
  margin-left: 60px;
}
</style>
