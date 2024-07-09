<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增/编辑合作组织"
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
      <el-form-item label=" 合作组织:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入合作组织" />
      </el-form-item>
      <el-form-item label="组织类型:" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label=" 联系人:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入联系人姓名" />
      </el-form-item>
      <el-form-item label=" 联系电话:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入联系电话" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
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
  region: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "",
  region: "",
});

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  region: [
    {
      required: true,
      message: "Please select Activity zone",
      trigger: "change",
    },
  ],
});

const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
</script>
<style lang="less" scoped></style>
