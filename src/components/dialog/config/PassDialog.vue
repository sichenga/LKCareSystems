<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改密码"
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
      <el-form-item label="输入新密码" prop="pass" class="inpt">
        <el-input v-model="ruleForm.pass" placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item label="再次输入新密码" prop="newpass">
        <el-input v-model="ruleForm.newpass" placeholder="请再次输入新密码" />
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
  pass: string;
  newpass: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  pass: "",
  newpass: "",
});

const rules = reactive<FormRules<RuleForm>>({
  pass: [{ required: true, message: "输入新密码不能为空", trigger: "blur" }],
  newpass: [
    { required: true, message: "再次输入密码不能为空", trigger: "blur" },
  ],
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
.is-required {
  margin-bottom: 20px;
}
.inpt {
  margin-left: 25px;
}
</style>
