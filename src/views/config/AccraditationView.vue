<template>
  <!-- 审批设置 -->
  <!-- dialog写在config文件夹下 -->
  <el-card style="max-width: 100%">
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate>
        <el-button type="primary" text @click="stream">配置审批流</el-button>
      </template>
    </MayTable>
    <Pagination :total="50" />
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, defineAsyncComponent, onMounted } from "vue";
import ApproveView from "@/database/ApproveView.json";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import { useRouter } from "vue-router";
const router = useRouter();
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
      width: "60",
    },

    {
      prop: "name",
      label: "审批流名称",
    },
    {
      prop: "updated",
      label: "更新日期",
    },
  ],
});

const getlist = () => {
  setTimeout(() => {
    data.tableData = ApproveView;
  }, 1000);
};
onMounted(() => {
  getlist();
});
//跳转页面
const stream = () => {
  router.push({
    path: "Deploy",
  });
};
</script>

<style lang="less" scoped></style>
