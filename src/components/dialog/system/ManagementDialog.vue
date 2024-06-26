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
      <el-form-item label="头像" prop="photo">
        <Upload :editdata="ruleForm.photo" @upload="selectMobile" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="ruleForm.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm.username" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="密码" prop="username">
        <el-input v-model="ruleForm.pwd" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="所属角色" prop="username">
        <el-select
          v-model="ruleForm.roleIds"
          clearable
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in roleData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="submit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { defineEmits, reactive, ref } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { AccountAdd } from "@/service/admin/AdminType";
import Upload from "@/components/upload/AvatarUpload.vue";
import { RoleList } from "@/service/role/RoleApi";
import {
  accountadd,
  accountget,
  rolelistForAccount,
} from "@/service/admin/AdminApi";
import { accountupdate } from "@/service/account/AccountApi";

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
});
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<AccountAdd>({
  username: "",
  pwd: "",
  name: "",
  photo: "",
  mobile: "",
  roleIds: [],
});

const rules = reactive<FormRules<AccountAdd>>({
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  mobile: [{ required: true, message: "手机号不能为空", trigger: "blur" }],
  username: [{ required: true, message: "账号不能为空", trigger: "blur" }],
  pwd: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  photo: [{ required: true, message: "请选择头像", trigger: "change" }],
  roleIds: [{ required: true, message: "请选择所属角色", trigger: "change" }],
});

//弹框
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
// 角色列表
const roleData = ref<any>([]);
// 获取角色列表
const getRoleList = async () => {
  const res: any = await RoleList();
  if (res?.code === 10000) {
    roleData.value = res.data.list.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  }
};
// 选择头像
const selectMobile = (val: string) => {
  ruleForm.photo = val;
};
// 提交表单
const submit = async () => {
  const isAdd = await ruleFormRef.value?.validate().catch(() => {});
  if (!isAdd) return false;
  let res: any;
  if (props.id) {
    res = await accountupdate(ruleForm);
  } else {
    res = await accountadd(ruleForm);
  }
  if (res?.code === 10000) {
    ElMessage.success(props.id ? "编辑成功" : "新增成功");
    close(true);
  } else {
    ElMessage.error(res.msg);
  }
};
// 数据回显
const getEdit = async () => {
  if (!props.id) return false;
  const res: any = await accountget(props.id);
  const role: any = await rolelistForAccount(props.id);
  if (res?.code === 10000 && role?.code === 10000) {
    Object.assign(ruleForm, res.data);
    ruleForm.roleIds = role.data.list.map((item: any) => item.id);
  }
};
onMounted(() => {
  getRoleList();
  getEdit();
});
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
.el-select {
  width: 300px;
}
</style>
