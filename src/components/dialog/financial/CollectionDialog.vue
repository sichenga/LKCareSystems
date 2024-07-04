<template>
  <el-dialog
    v-model="dialogVisible"
    title="缴费结算"
    width="500"
    @close="close"
  >
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="费用合计："> 6000.00 </el-form-item>
      <el-form-item label="长护险抵扣：">
        <el-input v-model="form.name" placeholder="2000.00" />
      </el-form-item>
      <el-form-item label="应收金额："> 4000.00 </el-form-item>
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
const form = reactive({
  name: "",
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
</style>
