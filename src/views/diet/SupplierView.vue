<template>
  <!-- 供应商管理 -->
  <div class="app-container">
    <div class="box">
      <el-button
        type="success"
        :icon="Plus"
        @click="onAdd"
        style="margin: 15px 0"
        >新增</el-button
      >
      <el-button
        style="margin: 15px"
        type="danger"
        :icon="Delete"
        v-if="ids.length >= 1"
        @click="handleDeleteAll()"
        >批量删除</el-button
      >
      <el-button
        type="danger"
        :icon="Delete"
        disabled
        style="margin: 15px"
        v-if="ids.length <= 0"
        >批量删除</el-button
      >
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        autoWidth="180px"
        :isMultiple="true"
        @serve-list-is="serveListIs"
      >
        <template #operate="scope">
          <el-button
            link
            size="small"
            type="primary"
            :icon="Edit"
            @click="handleEdit(scope.data.id)"
            >编辑</el-button
          >
          <el-button
            link
            size="small"
            type="danger"
            :icon="Delete"
            @click="handleDelete(scope.data.id)"
            >删除</el-button
          >
        </template>
      </MayTable>
      <!-- 分页 -->
      <Pagination
        :page="params.page"
        :psize="params.pageSize"
        :total="data.total"
        @page="page"
        @psize="psize"
      />
      <!-- 弹出框 -->
      <SupplierDialog v-if="isdialog" :id="editId" @close="close" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import SupplierDialog from "@/components/dialog/diet/SupplierDialog.vue";
import {
  Supplierdelete,
  SupplierList,
  SupplierAll,
} from "@/service/food/FoodApi";
import type { Supplier } from "@/service/food/FoodType";

const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);

const data = reactive({
  total: undefined,
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "供应商名称",
    },
    {
      prop: "foodCounts",
      label: "供给食材数",
    },
    {
      prop: "linkMan",
      label: "联系人",
    },
    {
      prop: "mobile",
      label: "联系电话",
    },
  ],
});
const params = reactive<Supplier>({
  total: 0,
  pageSize: 10,
  page: 1,
});
const getlist = async () => {
  const res: any = await SupplierList(params).catch(() => {});
  console.log("供应商列表", res);
  if (res.code == 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
  }
};
// 关闭弹窗
const isdialog = ref(false);
const close = (val: boolean) => {
  isdialog.value = false;
  if (val) {
    params.page = 1;
    getlist();
  }
};
// 分页
const page = (val: number) => {
  params.page = val;
  getlist();
};
const psize = (val: number) => {
  params.pageSize = val;
  getlist();
};
onMounted(() => {
  getlist();
});
// 编辑
const editId = ref(0);
const handleEdit = (id: any) => {
  isdialog.value = true;
  editId.value = id;
};
// 新增
const onAdd = () => {
  editId.value = 0;
  isdialog.value = true;
};
// 删除
const handleDelete = async (id: any) => {
  console.log("删除", id);
  let res = await getMessageBox("是否确认删除该供应商", "删除后将不可恢复");
  if (res) {
    const res: any = await Supplierdelete(id).catch(() => {});
    if (res.code == 10000) {
      ElMessage.success("删除成功");
      getlist();
    } else {
      ElMessage.error(res.msg);
    }
  } else {
    ElMessage.info("取消删除");
  }
};

// 批量删除
let ids = ref<any>([]);
const serveListIs = (val: any) => {
  ids.value = val.map((item: any) => item.id);
};
//批量删除
const handleDeleteAll = async () => {
  let res = await getMessageBox("是否确认删除该食材", "删除后将不可恢复");
  if (res) {
    const del: any = await SupplierAll(ids.value);
    if (del?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
    }
  } else {
    ElMessage.info("取消删除");
  }
};
</script>

<style lang="less" scoped>
.box {
  padding: 20px;
  background-color: #fff;

  .el-table {
    margin-top: 40px;
  }

  .pages {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
    margin-bottom: 20px;
  }
}
</style>
