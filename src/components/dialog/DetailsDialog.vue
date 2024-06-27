<template>
  <el-dialog
    v-model="dialogVisible"
    title="审批通过"
    width="700"
    @close="close"
  >
    <div>请上传床位变更的合同页照片,支持上传多张</div>
    <MassUpload />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="close(true)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from "vue";

const MassUpload = defineAsyncComponent(
  () => import("@/components/upload/MassUpload.vue")
);
//弹框
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
</script>

<style lang="less" scoped>
.demo-form-inline .el-input {
  --el-input-width: 150px;
}

.demo-form-inline .el-select {
  --el-select-width: 150px;
}
</style>
