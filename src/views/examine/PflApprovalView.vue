<template>
  <!-- 护理等级变更审批 -->
  <el-card style="max-width: 100%">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="老人姓名:">
        <el-input
          v-model="formInline.oldname"
          placeholder="请输入老人姓名"
          clearable
        />
      </el-form-item>
      <el-form-item label="身份证号码:">
        <el-input
          v-model="formInline.idcard"
          placeholder="请输入身份证号码"
          clearable
        />
      </el-form-item>
      <el-form-item label="性别:">
        <el-select v-model="formInline.sex" placeholder="请选择" clearable>
          <el-option label="男" value="0" />
          <el-option label="女" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="审批状态:">
        <el-select v-model="formInline.status" placeholder="请选择" clearable>
          <el-option label="待审批" value="0" />
          <el-option label="审批拒绝" value="1" />
          <el-option label="审批通过" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="max-width: 100%" class="card">
    <!-- 表格 -->
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate>
        <el-button type="primary" text @click="approve">审批</el-button>
        <el-button type="primary" text @click="details">详情</el-button>
      </template>
    </MayTable>
    <Pagination :total="50" />
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, defineAsyncComponent, onMounted } from "vue";
import GradeView from "@/database/GradeView.json";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import { useRouter } from "vue-router";
const router = useRouter();
const formInline = reactive({
  oldname: "",
  idcard: "",
  sex: "",
  status: "",
});

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
      prop: "oldname",
      label: "老人姓名",
    },
    {
      prop: "sex",
      label: "性别",
    },
    {
      prop: "idcard",
      label: "身份证号",
    },
    {
      prop: "raw",
      label: "原护理等级",
    },
    {
      prop: "now",
      label: "现护理等级",
    },
    {
      prop: "proposer",
      label: "申请人",
    },
    {
      prop: "application",
      label: "申请日期",
    },
    {
      prop: "status",
      label: "审批状态",
    },
  ],
});
//跳转
const approve = () => {
  router.push({
    path: "/dashboard/Details",
  });
};
const details = () => {
  router.push({
    path: "/dashboard/Details",
  });
};
const getlist = () => {
  setTimeout(() => {
    data.tableData = GradeView;
  }, 1000);
};
onMounted(() => {
  getlist();
});
</script>

<style lang="less" scoped>
.demo-form-inline .el-input {
  --el-input-width: 180px;
}

.demo-form-inline .el-select {
  --el-select-width: 180px;
}

.card {
  margin-top: 20px;
}
</style>
