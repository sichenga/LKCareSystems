<template>
  <!-- 结算单明细 -->
  <div class="form">
    <div class="l">
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="老人:"> 张国峰 </el-form-item>
        <el-form-item label="床位:"> 601-1 </el-form-item>
        <el-form-item label="入驻时间:"> 2020-02-02 </el-form-item>
        <el-form-item label="结算月份:"> 2020-12 </el-form-item>
        <el-form-item label="结算天数:"> 30 </el-form-item>
        <el-form-item label="费用合计:"> 9000.00 </el-form-item>
        <el-form-item>
          <div style="margin-left: 70px">
            <MayTable
              :tableData="data.tableData"
              :tableItem="data.tableItem"
              :isoperate="false"
            />
          </div>
        </el-form-item>
        <el-form-item label="应收金额:"> 7000.00 </el-form-item>
        <el-form-item label="实收金额:"> 7000.00 </el-form-item>
        <el-form-item label="缴费日期:"> 2020-03-03 </el-form-item>
      </el-form>
    </div>
    <div class="r">
      <h2>已缴费</h2>
    </div>
  </div>
  <div class="btn">
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
import PaidView from "@/database/PaidView.json";
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "charge",
      label: "收费项目",
      width: "150px",
    },
    {
      prop: "money",
      label: "金额",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = PaidView;
  }, 1000);
};
onMounted(() => {
  getlist();
});

const form = reactive({
  name: "",
});

// 返回
const back = () => {
  router.push("/dashboard/collection");
};
</script>

<style scoped lang="less">
.form {
  background-color: #fff;
  padding: 20px;
  display: flex;
  justify-content: space-between;

  .r {
    h2 {
      margin-right: 20px;
    }
  }
}

.btn {
  text-align: center;
  margin-top: 20px;
}
</style>
