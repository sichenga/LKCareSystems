<template>
  <!-- 健康档案管理 -->
  <el-tabs type="card" class="demo-tabs">
    <el-tab-pane label="健康档案" name="first">
      <RecordAdmin />
    </el-tab-pane>
    <el-tab-pane label="入院记录" name="second">
      <OutRecord />
    </el-tab-pane>
    <el-tab-pane label="出院记录" name="third">
      <OutRecord />
    </el-tab-pane>
    <el-tab-pane label="体检报告" name="fourth">
      <MedicalInfo />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from "vue";
const RecordAdmin = defineAsyncComponent(
  () => import("@/components/Record/RecordAdmin.vue")
);
const OutRecord = defineAsyncComponent(
  () => import("@/components/Record/OutRecord.vue")
);
const MedicalInfo = defineAsyncComponent(() => import("../MedicalViews.vue"));
</script>
<style lang="less" scoped></style>
