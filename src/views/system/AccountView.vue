<template>
  <!-- 账号管理 -->
  <el-card style="max-width: 100%">
    <el-button type="primary" @click="isdialog = true">新增</el-button>
    <ManagementDialog @close="close" v-if="isdialog" />
    <!-- 表格 -->
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate>
        <el-button type="primary" text @click="isdialog = true">编辑</el-button>
        <el-button type="primary" text @click="del">删除</el-button>
      </template>
    </MayTable>
    <Pagination :total="50" />
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import ManagementView from "@/database/ManagementView.json";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import ManagementDialog from "@/components/dialog/system/ManagementDialog.vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
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
      prop: "account",
      label: "账号",
    },
    {
      prop: "pass",
      label: "密码",
    },
    {
      prop: "role",
      label: "所属角色",
    },
    {
      prop: "founder",
      label: "创建人",
    },
    {
      prop: "addtime",
      label: "创建时间",
    },
  ],
});
//弹出框
const isdialog = ref(false);
const close = () => {
  isdialog.value = false;
};
// 删除
const del = async () => {
  let res = await getMessageBox("是否确认删除该角色", "删除后将不可恢复");
  console.log(1111, res);
  if (res) {
    ElMessage.success("删除成功");
  } else {
    ElMessage.info("取消删除");
  }
};
const getlist = () => {
  setTimeout(() => {
    data.tableData = ManagementView;
  }, 1000);
};
onMounted(() => {
  getlist();
});
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 20px;
}
</style>
