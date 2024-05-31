<template>
  <div>
    <!-- 健康信息 -->
    <Oldcase />
    <Oldcondition />
    <OldPhysical />
  </div>
</template>
<script lang="ts" setup>
// const Oldcase = defineAsyncComponent(() => import('@/components/addold/condition/OldCase.vue'))
import Oldcase from "@/components/addold/condition/OldCase.vue";
// const Oldcondition = defineAsyncComponent(
//   () => import('@/components/addold/condition/OldCondition.vue')
// )
import Oldcondition from "@/components/addold/condition/OldCondition.vue";
// const OldPhysical = defineAsyncComponent(
//   () => import('@/components/addold/condition/OldPhysical.vue')
// )
import OldPhysical from "@/components/addold/condition/OldPhysical.vue";
</script>
<style lang="less" scoped>
.title-btn {
  margin: 40px 690px;

  .el-button {
    width: 100px;
    height: 40px;
  }
}
</style>
