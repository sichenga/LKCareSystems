<template>
  <!--任务奖励设置 -->
  <div class="app-container">
    <div class="box">
    <div class="s1">
      <span><i>▋</i>任务奖励积分设置</span>
    </div>
    <!-- 表格 :identifier="identifier"-->
    <MayTable
      :tableData="data.tableData"
      :tableItem="data.tableItem"
      :isoperate="false"
    />
    <div class="s2">
      <span><i>▋</i>积分与人民币比率设置</span>
    </div>
    <div class="s3">1积分 = <input type="text" /> 人民币</div>
    <div class="save">
      <el-button type="primary">保存设置</el-button>
    </div>
  </div>
  </div>
  
</template>

<script lang="ts" setup>
import { reactive, onMounted, defineAsyncComponent } from "vue";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
import TaskView from "@/database/TaskView.json";
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "task",
      label: "任务名称",
    },
    {
      prop: "input",
      label: "奖励积分",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = TaskView;
  }, 1000);
};
onMounted(() => {
  getlist();
});
</script>

<style scoped lang="less">
.box {
  padding: 20px;
  background-color: #fff;

  .s1 {
    margin-bottom: 40px;

    i {
      font-style: normal;
      color: #409eff;
    }
  }

  .s2 {
    margin-top: 40px;

    i {
      font-style: normal;
      color: #409eff;
    }
  }

  .s3 {
    margin-top: 30px;
  }

  .save {
    margin-top: 30px;
    margin-bottom: 20px;
    text-align: center;
  }
}
</style>
