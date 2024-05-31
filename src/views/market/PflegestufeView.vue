<template>
  <!-- dialog写在market文件夹下 -->
  <!-- <div>护理等级变更</div> -->
  <el-card style="max-width: 100%">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="老人姓名">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="变更日期">
        <TimePicker />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.region" placeholder="请选择" clearable>
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="max-width: 100%; margin-top: 20px">
    <el-button
      type="primary"
      style="margin-bottom: 20px"
      @click="isdialog = true"
      >新增护理等级变更</el-button
    >
    <PfleGestufeDialog v-if="isdialog" @close="close" />
    <!-- 表格 -->
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate>
        <el-button text type="primary">编辑</el-button>
        <el-button text type="primary" @click="details">查看详情</el-button>
      </template>
    </MayTable>
    <Pagination :total="50" />
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import PflegestufeView from "@/database/PflegestufeView.json";
const TimePicker = defineAsyncComponent(
  () => import("@/components/timepicker/MayTimePicker.vue")
);
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const PfleGestufeDialog = defineAsyncComponent(
  () => import("@/components/dialog/market/PfleGestufeDialog.vue")
);
import { useRouter } from "vue-router";
const router = useRouter();
const formInline = reactive({
  user: "",
  region: "",
  date: "",
});
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "oldman",
      label: "老人姓名",
    },
    {
      prop: "sex",
      label: "性别",
    },
    {
      prop: "idcard",
      label: "身份证号",
      width: "200px",
    },
    {
      prop: "grade",
      label: "原护理等级",
    },
    {
      prop: "cashgrade",
      label: "现护理等级",
    },
    {
      prop: "applicat",
      label: "申请人",
    },
    {
      prop: "addTime",
      label: "申请日期",
      width: "200px",
    },
    {
      prop: "status",
      label: "状态",
    },
  ],
});

const getlist = () => {
  setTimeout(() => {
    data.tableData = PflegestufeView;
  }, 1000);
};
onMounted(() => {
  getlist();
});
//弹窗
const isdialog = ref(false);
const close = () => {
  isdialog.value = false;
};
//跳转详情页面
const details = () => {
  router.push("/market/PflegestufeInfo");
};
</script>

<style lang="less" scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
