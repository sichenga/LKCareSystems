<template>
  <!-- 配置审批流 -->
  <div class="app-container">
    <el-card style="max-width: 100%">
    <div class="header">审批流名称：<span>床位变更申请审批</span></div>
    <el-button type="primary" @click="isdialog = true">新增审批人 </el-button>
    <DeployDialog @close="close" v-if="isdialog" />
    <MayTable
      :tableData="data.tableData"
      :tableItem="data.tableItem"
      :identifier="identifier"
    >
      <template #operate>
        <el-button type="primary" text @click="del">删除</el-button>
        <el-button type="primary" text>上移</el-button>
        <el-button type="primary" text>下移</el-button>
      </template>
    </MayTable>
    <Pagination :total="50" />
  </el-card>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, reactive, defineAsyncComponent, onMounted } from "vue";
import DeployDialog from "@/components/dialog/config/DeployDialog.vue";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const identifier = "Workers";

const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
      width: "60",
    },

    {
      prop: "image",
      label: "头像",
    },
    {
      prop: "name",
      label: "姓名",
    },
    {
      prop: "tel",
      label: "手机号",
    },
    {
      prop: "department",
      label: "部门",
    },
    {
      prop: "role",
      label: "角色",
    },
  ],
});

const getlist = () => {
  // setTimeout(() => {
  //     data.tableData = DeployView
  // }, 1000)
};
onMounted(() => {
  getlist();
});
//弹出框
const isdialog = ref(false);
const close = () => {
  isdialog.value = false;
};
//删除
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
const del = async () => {
  let res = await getMessageBox("是否确认删除该人员", "删除后将不可恢复");
  console.log(1111, res);
  if (res) {
    ElMessage.success("删除成功");
  } else {
    ElMessage.info("取消删除");
  }
};
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  line-height: 50px;
  font-size: 12px;
}
.el-button {
  margin-bottom: 20px;
}
</style>
