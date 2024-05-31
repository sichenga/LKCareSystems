<template>
  <el-dialog
    v-model="dialogVisible"
    :title="ruleForm.id ? '修改部门' : '增加部门'"
    width="500"
    @close="handleClose"
  >
    {{ ruleForm }}
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose"> 取消 </el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, defineProps } from "vue";
import { ElMessage } from "element-plus";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import type { AddDepartmentParams } from "@/service/staff/StaffType";
import { addDepartment, updateDepartment } from "@/service/staff/StaffApi";
// 父传子
const props = defineProps({
  // 部门pid
  deppid: {
    type: Number,
    default: 0,
  },
  // 部门id
  depid: {
    type: Number,
    default: 0,
  },
  depname: {
    type: String,
    default: "",
  },
});

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<AddDepartmentParams>({
  id: props.depid,
  name: props.depname,
  pid: props.deppid,
});
const rules = reactive<FormRules<AddDepartmentParams>>({
  name: [
    {
      required: true,
      message: "请输入部门名称",
      trigger: "blur",
    },
  ],
});

const dialogVisible = ref(true);
// 子传父
const emit = defineEmits(["close"]);
// 关闭
const handleClose = (close: boolean = false) => {
  emit("close", close);
};
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate().catch(() => {});
  if (valid) {
    let res: any;
    if (!ruleForm.id) {
      res = await addDepartment(ruleForm).catch(() => {});
    } else {
      res = await updateDepartment(ruleForm).catch(() => {});
    }
    console.log("添加部门", res);
    if (res?.code == 10000) {
      ElMessage.success((ruleForm.id ? "修改" : "添加") + "成功");
      handleClose(true);
    }
  }
};
</script>
<style lang="less" scoped></style>
