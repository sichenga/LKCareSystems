<template>
  <!-- 岗位管理 -->
  <div class="app-container">
    <div class="box">
      <el-button class="mb" type="success" :icon="Plus" @click="add"
        >新增岗位</el-button
      >
      <el-button
        class="mb"
        type="danger"
        :icon="Delete"
        :disabled="isdisabled"
        @click="handleDelete(delAllData)"
        >批量删除</el-button
      >
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        autoWidth="200px"
        @serve-list-is="serveListIs"
        :isMultiple="true"
      >
        <template #operate="{ data }">
          <el-button
            link
            type="primary"
            :icon="Edit"
            @click="handleEdit(data.id)"
            >编辑</el-button
          >
          <el-button
            link
            type="danger"
            :icon="Delete"
            @click="handleDelete(data.id)"
            >删除</el-button
          >
        </template>
      </MayTable>
      <!-- 分页 -->
      <Pagination
        :page="params.page"
        :psize="params.pageSize"
        :total="total"
        @page="getpage"
        @psize="getpsize"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { DelList, RoleList, deleteAll } from "@/service/role/RoleApi";
import type { Roletype } from "@/service/role/Roletype";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";

const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const total = ref(0);
const params = reactive<Roletype>({
  page: 1,
  pageSize: 10,
});
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "岗位名称",
    },
    {
      prop: "accountCounts",
      label: "关联账号数",
    },
    {
      prop: "addAccountName",
      label: "创建人",
    },
    {
      prop: "addTime",
      label: "创建日期",
    },
  ],
});
const getlist = async () => {
  const res: any = await RoleList(params);
  console.log("岗位列表", res);
  if (res?.code === 10000) {
    total.value = res.data.counts;
    data.tableData = res.data.list;
  }
};
// 新增
const add = () => {
  console.log("新增");
  router.push("/personel/position-add");
};
// 编辑
const handleEdit = (id: number) => {
  console.log("编辑", id);
  router.push({
    path: `/personel/position-edit/${id}`,
  });
};
// 批量删除按钮是否可以点击
const isdisabled = ref(true);
// 删除
const handleDelete = async (id: any) => {
  console.log("删除", id);
  let res = await getMessageBox("是否确认删除该岗位", "删除后将不可恢复");
  if (!res) {
    return ElMessage.info("取消删除");
  }
  let del: any;
  if (Array.isArray(id)) {
    del = await deleteAll(id);
  } else {
    del = await DelList(id);
  }
  if (del?.code === 10000) {
    ElMessage.success("删除成功");
    getlist();
  }
  // } else {
  //   ElMessage.info("取消删除");
  // }
};
const delAllData = ref<any>([]);
// 获取批量删除数据
const serveListIs = (val: any) => {
  if (val.length) {
    isdisabled.value = false;
  } else {
    isdisabled.value = true;
  }
  delAllData.value = val.map((item: any) => item.id);
};
// 分页
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

<style lang="less" scoped>
.box {
  background-color: #fff;
  padding: 20px;
}
:deep(.el-tree-node__content) {
  height: 33px;
  margin-bottom: 5px;
}
</style>
