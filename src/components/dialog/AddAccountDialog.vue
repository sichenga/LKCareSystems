<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增账号"
    width="500"
    @close="close"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :size="formSize"
      class="demo-ruleForm"
      label-width="auto"
      status-icon
      style="max-width: 600px"
    >
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机号：" prop="mobile">
        <el-input v-model="ruleForm.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="账号：" prop="username">
        <el-input v-model="ruleForm.username" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="密码：" prop="pwd">
        <el-input v-model="ruleForm.pwd" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="所属角色" prop="roleIds">
        <el-select
          v-model="ruleForm.roleIds"
          multiple
          placeholder="请选择"
          style="width: 300px"
          @change="rolechange"
        >
          <el-option
            v-for="item in roledata"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { defineEmits, defineProps, onMounted, reactive, ref, watch } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import {
  accountadd,
  accountinfo,
  accountupdate,
  rolelist,
  rolelistForAccount,
} from "@/service/account/AccountApi";
import type { AddAccount, Role } from "@/service/account/AccountType";

const props = defineProps({
  editid: {
    type: Number,
    default: 0,
  },
});
// 数据回显
watch(
  () => props.editid,
  async (newval) => {
    if (newval) {
      let info: any = await accountinfo(newval);
      let role: any = await rolelistForAccount(newval);
      console.log("编辑", info, role);
      if (info?.code === 10000 && role?.code === 10000) {
        Object.assign(ruleForm, info.data);
        ruleForm.roleIds = role.data.list.map((item: any) => item.id);
      }
    }
  },
  {
    immediate: true,
  }
);

const formSize = ref<ComponentSize>("default");

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<AddAccount>({
  id: 0,
  username: "",
  pwd: "",
  name: "",
  enable: 0,
  mobile: "",
  roleIds: [],
});
const rules = reactive<FormRules<AddAccount>>({
  name: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "blur",
    },
  ],
  username: [
    {
      required: true,
      message: "请输入账号",
      trigger: "blur",
    },
  ],
  pwd: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
  roleIds: [
    {
      required: true,
      message: "请输入所属角色",
      trigger: "change",
    },
  ],
});
const dialogVisible = ref(true);
const roledata = ref<Array<Role>>([]);
const emit = defineEmits(["close"]);
// 关闭弹框
const close = (close: boolean = false) => {
  emit("close", close);
};
// 获取角色列表
const getrolelist = async () => {
  let res: any = await rolelist();
  console.log("角色", res);
  if (res?.code === 10000) {
    roledata.value = res.data.list.map((item: any) => ({
      name: item.name,
      id: item.id,
    }));
  }
};
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate();
  if (valid) {
    let res: any;
    let msg: string;
    if (ruleForm.id === 0) {
      res = await accountadd(ruleForm).catch(() => {});
      msg = "增加";
    } else {
      res = await accountupdate(ruleForm).catch(() => {});
      msg = "编辑";
    }
    console.log("增加账号", res);
    if (res?.code === 10000) {
      close(true);
      ElMessage.success(`${msg}成功`);
    } else {
      ElMessage.error(res.msg);
    }
  }
};
// 选择角色
const rolechange = (val: any) => {
  console.log("角色", val);
};
onMounted(() => {
  getrolelist();
});
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
</style>
