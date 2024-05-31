<template>
  <!-- 入院费用核对管理 -->
  <!-- 查询 -->
  <el-card>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="老人姓名：">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="formInline.region" placeholder="请选择" clearable>
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card class="table">
    <!-- 表格 -->
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate>
        <el-button type="primary" size="small" link @click="pay"
          >缴费结算</el-button
        >
        <el-button type="primary" size="small" link @click="detail"
          >查看明细</el-button
        >
      </template>
    </MayTable>
    <!-- 分页 -->
    <Pagination :total="50" />
    <!-- 缴费结算 -->
    <AdmissionDialog @close="close" v-if="isdialog" />
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import AdmissionDialog from "@/components/dialog/financial/AdmissionDialog.vue";
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import AdmissionView from "@/database/AdmissionView.json";
const isdialog = ref(false);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "old",
      label: "老人",
    },
    {
      prop: "sex",
      label: "性别",
    },
    {
      prop: "age",
      label: "年龄",
    },
    {
      prop: "bed",
      label: "床位",
    },
    {
      prop: "check",
      label: "入住日期",
    },
    {
      prop: "days",
      label: "核定天数",
    },
    {
      prop: "cash",
      label: "押金",
    },
    {
      prop: "agency",
      label: "一次性代办费",
      width: "140",
    },
    {
      prop: "bunk",
      label: "床位费",
    },
    {
      prop: "nursing",
      label: "护理费",
    },
    {
      prop: "board",
      label: "膳食费",
    },
    {
      prop: "deduction",
      label: "定金抵扣",
    },
    {
      prop: "summation",
      label: "合计",
    },
    {
      prop: "state",
      label: "状态",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = AdmissionView;
  }, 1000);
};
// 关闭弹窗
const close = () => {
  isdialog.value = false;
};
onMounted(() => {
  getlist();
});
// 缴费结算
const pay = () => {
  console.log("缴费结算 ");
  isdialog.value = true;
};
//  查看明细
const detail = () => {
  console.log("查看明细");
  isdialog.value = true;
  // router.push("/dashboard/receiving")
};
const formInline = reactive({
  user: "",
  region: "",
  date: "",
});

const onSubmit = () => {
  console.log("submit!");
};
</script>

<style scoped lang="less">
.el-form {
  margin-top: 15px;
}

.table {
  margin-top: 20px;
}
</style>
<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
