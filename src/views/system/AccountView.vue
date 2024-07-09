<template>
  <!-- 账号管理 -->
  <div class="app-container">
    <el-card style="max-width: 100%">
      <el-button
        type="primary"
        @click="isdialog = true"
        style="margin-bottom: 15px"
        >新增</el-button
      >
      <ManagementDialog v-if="isdialog" :id="deitID" @close="close" />
      <!-- 表格 -->
      <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
        <template #operate="{ data }">
          <el-button text type="primary" @click="edit(data.id)">编辑</el-button>
          <el-button text type="primary" @click="del(data.id)">删除</el-button>
        </template>
      </MayTable>
      <Pagination :total="total" @page="getpage" @psize="getpsize" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import ManagementDialog from "@/components/dialog/system/ManagementDialog.vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { accountdelete, adminList } from "@/service/admin/AdminApi"; // import ManagementView from "@/database/ManagementView.json";
// import ManagementView from "@/database/ManagementView.json";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
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
      prop: "mobile",
      label: "手机号",
    },
    {
      prop: "username",
      label: "账号",
    },
    {
      prop: "",
      label: "密码",
    },
  ],
});
//弹出框
const isdialog = ref(false);
const close = (isclose: boolean) => {
  if (isclose) {
    getlist();
  }
  if (deitID.value) {
    deitID.value = 0;
  }
  isdialog.value = false;
};
// 编辑
// 账号id
const deitID = ref(0);
const edit = (id: number) => {
  console.log(id);
  deitID.value = id;
  isdialog.value = true;
};
// 删除
const del = async (id: number) => {
  let res = await getMessageBox("是否确认删除该角色", "删除后将不可恢复");
  console.log(1111, res);
  if (!res) return ElMessage.info("取消删除");
  const del: any = await accountdelete(id);
  if (del?.code === 10000) {
    ElMessage.success("删除成功");
    await getlist();
  }
};
//账号列表数据
const total = ref(0);
const params = reactive({
  page: 1,
  pageSize: 10,
});
// 获取账号列表数据
const getlist = async () => {
  const res: any = await adminList(params);
  if (res?.code === 10000) {
    total.value = res.data.counts;
    data.tableData = res.data.list;
  }
};
//分页
const getpage = (val: number) => {
  params.page = val;
  getlist();
};
const getpsize = (val: number) => {
  params.pageSize = val;
  getlist();
};
onMounted(() => {
  getlist();
});
</script>

<style lang="less" scoped></style>
