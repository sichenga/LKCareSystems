<template>
  <el-dialog v-model="dialogVisible" title="延期" width="500" @close="close">
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
      <el-form-item label="延长时间" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="延长原因" prop="name">
        <el-input
          v-model="ruleForm.name"
          style="width: 300px"
          :rows="2"
          type="textarea"
          placeholder="Please input"
        />
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
