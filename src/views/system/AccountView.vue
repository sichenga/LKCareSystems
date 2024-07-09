<template>
  <!-- 账号列表-->
  <div class="app-container">
    <el-card style="max-width: 100%">
      <el-button
        @click="isdialog = true"
        style="margin-bottom: 15px"
        :icon="Plus"
        type="success"
        >新增</el-button
      >
      <el-button
        :icon="Delete"
        type="danger"
        style="margin-bottom: 15px"
        @click="delAll"
        :disabled="data.ids.length <= 0"
        >批量删除</el-button
      >
      <ManagementDialog v-if="isdialog" :id="deitID" @close="close" />
      <!-- 表格 -->
      <MayTable
        :isMultiple="true"
        autoWidth="200px"
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        @serve-list-is="serveListIs"
      >
        <template #operate="{ data }">
          <el-button :icon="Edit" text type="primary" @click="edit(data.id)"
            >编辑</el-button
          >
          <el-button :icon="Delete" text type="danger" @click="del(data.id)"
            >删除</el-button
          >
        </template>
      </MayTable>
      <Pagination :total="total" @page="getpage" @psize="getpsize" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import ManagementDialog from "@/components/dialog/system/ManagementDialog.vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { accountdelete, adminList, deleteAll } from "@/service/admin/AdminApi"; // import ManagementView from "@/database/ManagementView.json";
// import ManagementView from "@/database/ManagementView.json";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const serveListIs = (val: any) => {
  const ids = val.map((item: any) => item.id);
  data.ids = ids;
};
const data = reactive({
  ids: [] as any,
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
// 批量删除
const delAll = async () => {
  let res = await getMessageBox("是否确认批量删除该账号", "删除后将不可恢复");
  if (!res) return ElMessage.info("取消删除");
  const del: any = await deleteAll(data.ids);
  if (del?.code === 10000) {
    ElMessage.success("删除成功");
    await getlist();
  }
};
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
  let res = await getMessageBox("是否确认删除该账号", "删除后将不可恢复");
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
