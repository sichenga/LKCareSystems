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
      status-icon
    >
      <el-form-item label="输入旧密码:" prop="pwd" class="input">
        <el-input
          v-model="ruleForm.pwd"
          placeholder="请输入旧密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="输入新密码:" prop="newPwd" class="input">
        <el-input
          v-model="ruleForm.newPwd"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="再次输入新密码:" prop="newpass" class="input">
        <el-input
          v-model="ruleForm.newpass"
          placeholder="请再次输入新密码"
          show-password
        />
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
import { ref, reactive, defineEmits } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { RuleFormPwd } from "@/service/system/SystemType";
import { PutUpdatePwd } from "@/service/system/SystemApi";
import { ElMessage } from "element-plus";
const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive<RuleFormPwd>({
  pwd: "", //旧密码
  newPwd: "", //新密码
  newpass: "", //再次输入新密码
});
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (ruleForm.newpass !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("newpass");
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== ruleForm.newPwd) {
    callback(new Error("俩次密码不一致"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules<RuleFormPwd>>({
  pwd: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPwd: [{ required: true, validator: validatePass, trigger: "blur" }],
  newpass: [{ required: true, validator: validatePass2, trigger: "blur" }],
});

//弹框
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
//确定修改密码
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res: any = await PutUpdatePwd(ruleForm);
      console.log(res);
      if (res?.code == 10000) {
        close(true);
        ElMessage.success("修改成功");
      } else if (res?.code == 14000) {
        ElMessage.error(res.msg);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
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

.input {
  margin-bottom: 20px;
}
</style>
