<template>
  <el-dialog
    v-model="dialogVisible"
    title="出院结算"
    width="500"
    @close="close"
  >
    <div class="from">
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
        <el-form-item label="应退费用：" prop="name"> 6000.00 </el-form-item>
        <el-form-item label="出院日期:" prop="name"> 2020-03-02 </el-form-item>
        <el-form-item label="实退费用：" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="close(true)"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { defineEmits, reactive, ref } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";

interface RuleForm {
  name: string;
}
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "",
});
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
});

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

.from {
  border-bottom: 1px solid #ededed;
}
</style>
