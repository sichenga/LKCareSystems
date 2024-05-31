<template>
  <!-- 薪资明细 -->
  <div class="box">
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="护工姓名：">
        <span>张国峰</span>
      </el-form-item>
      <el-form-item label="联系方式：">
        <span>17768927182</span>
      </el-form-item>
      <el-form-item label="身份证号：">
        <span>212871288881212</span>
      </el-form-item>
      <el-form-item label="统计月份：">
        <span>2020-08</span>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">
    <MayTable
      :tableData="data.tableData"
      :tableItem="data.tableItem"
      :isoperate="false"
    />
  </div>
  <!-- 返回 -->
  <div class="back">
    <el-button @click="back">返回</el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const form = reactive({
  name: "",
});
import DetailView from "@/database/DetailView.json";
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "date",
      label: "日期",
    },
    {
      prop: "point",
      label: "获得积分",
    },
    {
      prop: "paid",
      label: "获得薪资",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = DetailView;
  }, 1000);
};
onMounted(() => {
  getlist();
});
// 返回
const back = () => {
  router.go(-1);
};
</script>

<style scoped lang="less">
.box {
  height: 220px;
  padding: 20px;
  background-color: #fff;
  margin-bottom: 10px;
}

.table {
  background-color: #fff;
  padding: 20px;
}

.back {
  text-align: center;
  margin-top: 20px;
}
</style>
