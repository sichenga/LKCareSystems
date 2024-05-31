<template>
  <el-dialog
    v-model="dialogVisible"
    title="增加夜巡"
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
      <el-form-item label="巡检地点：" prop="address">
        <el-input v-model="ruleForm.address" />
      </el-form-item>
      <el-form-item label="巡检状态：" prop="state">
        <el-input v-model="ruleForm.state" />
      </el-form-item>
      <el-form-item label="巡检记录：" prop="comment">
        <el-input v-model="ruleForm.comment" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, defineEmits } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { patrolAdd } from "@/service/patrol/PatrolApi";
import type { PatrolAdd } from "@/service/patrol/PatrolType";
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<PatrolAdd>({
  address: "",
  state: "",
  comment: "",
});
const rules = reactive<FormRules<PatrolAdd>>({
  address: [
    {
      required: true,
      message: "请输入巡检地点",
      trigger: "blur",
    },
  ],
  state: [
    {
      required: true,
      message: "请输入巡检状态",
      trigger: "blur",
    },
  ],
  comment: [
    {
      required: true,
      message: "请输入巡检记录",
      trigger: "blur",
    },
  ],
});
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
// 关闭弹窗
const close = (close: boolean = false) => {
  emit("close", close);
};
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate();
  if (valid) {
    let res: any = await patrolAdd(ruleForm).catch(() => {});
    console.log("增加", res);
    if (res?.code === 10000) {
      ElMessage.success("添加成功");
      close(true);
    }
  }
};
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
</style>
