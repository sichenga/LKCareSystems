<template>
  <!-- <div>行政查房</div> -->
  <div class="app-container">
    <el-card style="max-width: 100%">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="查房人">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="记录时间">
        <MayTimePicker />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="max-width: 100%; margin-top: 20px">
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate>
        <el-button type="primary" text @click="details">查看详情</el-button>
      </template>
    </MayTable>
    <Pagination :total="50" />
  </el-card>
  </div>
  
</template>
<script lang="ts" setup>
import { reactive, onMounted, defineAsyncComponent } from "vue";
import WardRoundView from "@/database/WardRoundView.json";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const MayTimePicker = defineAsyncComponent(
  () => import("@/components/timepicker/MayTimePicker.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import { useRouter } from "vue-router";
const router = useRouter();
const formInline = reactive({
  user: "",
  region: "",
  date: "",
});
const data = reactive({
  tables: [
    { lable: "未签约", id: "0" },
    { lable: "预定中", id: "1" },
    { lable: "已入院", id: "2" },
  ] as any,
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
      width: "100px",
    },
    {
      prop: "watcher",
      label: "查房人",
      width: "200px",
    },
    {
      prop: "clock",
      label: "记录人",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = WardRoundView;
  }, 1000);
};
//跳转详情页面
const details = () => {
  router.push("/market/WardRoundInfo");
};
onMounted(() => {
  getlist();
});
</script>

<style scoped></style>
