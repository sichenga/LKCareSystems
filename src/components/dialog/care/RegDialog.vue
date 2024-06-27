<template>
  <el-dialog v-model="dialogVisible" title="延期" width="500" @close="close">
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
      <el-form-item label="延长时间" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="延长原因" prop="name">
        <el-input
          v-model="ruleForm.name"
          :rows="2"
          placeholder="Please input"
          style="width: 300px"
          type="textarea"
        />
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
import { defineEmits, reactive, ref } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<any>({});
const rules = reactive<FormRules<any>>({});
const dialogVisible = ref(true);
const oldmanlist = ref([]);
const bedlist = ref([]);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
</style>
