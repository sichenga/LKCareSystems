<template>
  <el-dialog
    v-model="dialogVisible"
    title="标记已结算"
    width="500"
    @close="close"
  >
    <div><h2>是否确认标记当前用户当前月的薪资为已结算</h2></div>
    <div>标记后当前月的积分将清零</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="close(true)"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { defineEmits, ref } from "vue";

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
</style>
