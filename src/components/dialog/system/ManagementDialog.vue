<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增账号"
    width="500"
    @close="close"
  >
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机号" prop="tel">
        <el-input v-model="ruleForm.tel" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input v-model="ruleForm.account" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model="ruleForm.pass" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="所属角色" prop="role">
        <el-select v-model="ruleForm.role" placeholder="请选择">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="close(true)"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, defineEmits } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
interface RuleForm {
  name: string;
  tel: string;
  account: string;
  pass: string;
  role: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "",
  tel: "",
  account: "",
  pass: "",
  role: "",
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  tel: [{ required: true, message: "手机号不能为空", trigger: "blur" }],

  account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
  pass: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  role: [{ required: true, message: "请选择所属角色", trigger: "blur" }],
});

//弹框
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
.el-select {
  width: 300px;
}
</style>
