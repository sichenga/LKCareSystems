<template>
  <!-- 投诉建议 -->
  <!-- dialog写在market文件夹下 -->
  <el-card style="max-width: 100%">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="标题">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="反馈渠道">
        <el-select v-model="formInline.region" placeholder="请选择" clearable>
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
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
  <el-card style="max-width: 100%" class="card">
    <!-- 表格 -->
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate>
        <el-button type="primary" text>编辑</el-button>
        <el-button type="primary" text @click="details">详情</el-button>
        <el-button type="primary" text>标记已处理</el-button>
      </template>
    </MayTable>
    <Pagination :total="50" />
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, onMounted, defineAsyncComponent } from "vue";
import ComplaintView from "@/database/ComplaintView.json";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
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
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "title",
      label: "标题",
      width: "180px",
    },
    {
      prop: "feedback",
      label: "反馈渠道",
    },
    {
      prop: "complaint",
      label: "投诉建议人",
    },
    {
      prop: "addTime",
      label: "提交时间",
      width: "150px",
    },

    {
      prop: "executor",
      label: "任务执行人",
    },
    {
      prop: "completiontime",
      label: "完成处理时间",
      width: "150px",
    },
    {
      prop: "status",
      label: "状态",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = ComplaintView;
  }, 1000);
};
onMounted(() => {
  getlist();
});
//跳转页面
const details = () => {
  router.push("/market/ComplaintInfo");
};
</script>

<style lang="less" scoped>
.card {
  margin-top: 20px;
}

.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
