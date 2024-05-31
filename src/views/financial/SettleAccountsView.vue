<template>
  <!-- 出院结算 -->
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
        <el-button type="primary" size="small" link @click="hospital"
          >出院结算</el-button
        >
        <el-button type="primary" size="small" link @click="detail"
          >查看明细</el-button
        >
      </template>
    </MayTable>
    <!-- 分页 -->
    <Pagination :total="50" />
    <!-- 缴费结算 -->
    <HospitalDialog @close="close" v-if="isdialog" />
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import HospitalDialog from "@/components/dialog/financial/HospitalDialog.vue";
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import HospitalView from "@/database/HospitalView.json";
const isdialog = ref(false);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "bed",
      label: "床位",
    },
    {
      prop: "room",
      label: "房间",
    },
    {
      prop: "old",
      label: "老人姓名",
    },
    {
      prop: "sex",
      label: "性别",
    },
    {
      prop: "ibnumber",
      label: "身份证号",
    },
    {
      prop: "discharge",
      label: "预计出院时间",
    },
    {
      prop: "reason",
      label: "出院原因",
    },
    {
      prop: "state",
      label: "状态",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = HospitalView;
  }, 1000);
};
// 关闭弹窗
const close = () => {
  isdialog.value = false;
};
onMounted(() => {
  getlist();
});
//出院结算
const hospital = () => {
  console.log("出院结算 ");
  isdialog.value = true;
};
//  查看明细
const detail = () => {
  console.log("查看明细");
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
