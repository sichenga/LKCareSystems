<template>
  <el-dialog
    v-model="centerDialogVisible"
    :title="props.title"
    :width="props.width"
    align-center
    @close="close"
  >
    <slot name="dialog"></slot>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="close(true)"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, defineEmits, defineProps } from "vue";
const emit = defineEmits(["close"]);
const props = defineProps({
  title: {
    type: String,
    default: "标题",
  },
  width: {
    type: String,
    default: "30%",
  },
});
// 弹框显示隐藏
const centerDialogVisible = ref(true);
// 关闭弹框
const close = (isclose: boolean = false) => {
  emit("close", isclose);
};
// watch
</script>
<style lang="less" scoped></style>
