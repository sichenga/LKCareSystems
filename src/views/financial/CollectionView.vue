<template>
  <!-- 催收管理 -->
  <!-- 查询 -->
  <el-card>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="老人姓名：">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="统计年月:">
        <el-select v-model="formInline.region" placeholder="请选择" clearable>
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
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
    <CollectionDialog @close="close" v-if="isdialog" />
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import CollectionDialog from "@/components/dialog/financial/CollectionDialog.vue";
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import CollectionView from "@/database/CollectionView.json";
const isdialog = ref(false);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "year",
      label: "统计年月",
    },
    {
      prop: "old",
      label: "老人",
    },
    {
      prop: "bed",
      label: "床位",
    },
    {
      prop: "time",
      label: "入住时间",
    },
    {
      prop: "accommodation",
      label: "床位费",
    },
    {
      prop: "arrival",
      label: "护理费",
    },
    {
      prop: "nursing",
      label: "膳食费",
    },
    {
      prop: "deduction",
      label: "长护险抵扣",
    },
    {
      prop: "amount",
      label: "应收金额",
    },
    {
      prop: "received",
      label: "实收金额",
    },
    {
      prop: "state",
      label: "状态",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = CollectionView;
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
  router.push("/dashboard/paid");
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
