<template>
  <!-- 薪资福利结算 -->
  <!-- 查询 -->
  <el-card>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="护工姓名：">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="联系方式:">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="身份证号：">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="统计月份：">
        <el-select v-model="formInline.region" placeholder="请选择" clearable>
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="结算状态：">
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
    <el-button type="primary" style="margin-bottom: 30px">标记已结算</el-button>
    <!-- 表格 -->
    <MayTable
      :isMultiple="true"
      :tableData="data.tableData"
      :tableItem="data.tableItem"
      :identifier="identifier"
    >
      <template #operate>
        <el-button type="primary" size="small" link @click="detail"
          >薪资明细</el-button
        >
        <el-button type="primary" size="small" link @click="settled"
          >标记已结算</el-button
        >
      </template>
    </MayTable>
    <!-- 分页 -->
    <Pagination :total="50" />
    <!-- 标记已结算 -->
    <WelfareDialog @close="close" v-if="isdialog" />
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import WelfareDialog from "@/components/dialog/financial/WelfareDialog.vue";
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import WelfareView from "@/database/WelfareView.json";
const identifier = "Workers";
const isdialog = ref(false);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "image",
      label: "头像",
    },
    {
      prop: "name",
      label: "姓名",
    },
    {
      prop: "contact",
      label: "联系方式",
    },
    {
      prop: "ibnumber",
      label: "身份证号",
    },
    {
      prop: "payroll",
      label: "薪资合计",
    },
    {
      prop: "settled",
      label: "待结算薪资",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = WelfareView;
  }, 1000);
};
// 关闭弹窗
const close = () => {
  isdialog.value = false;
};
onMounted(() => {
  getlist();
});
//薪资明细
const detail = () => {
  console.log("薪资明细 ");
  router.push("/dashboard/detail");
};
//标记已结算
const settled = () => {
  console.log("标记已结算");
  isdialog.value = true;
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
