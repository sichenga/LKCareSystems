<template>
  <!-- 角色管理 -->
  <div class="app-container">
    <el-card>
      <div style="margin: 15px 0">
        <el-button type="success" :icon="Plus" @click="addRole">新增</el-button>
        <el-button
          :icon="Delete"
          type="danger"
          @click="delAll"
          :disabled="data.ids.length <= 0"
          >批量删除</el-button
        >
      </div>
      <!-- 表格 -->
      <MayTable
        :isMultiple="true"
        autoWidth="200px"
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        @serve-list-is="serveListIs"
      >
        <template #operate="{ data }">
          <el-button :icon="Edit" type="primary" text @click="edit(data.id)"
            >编辑</el-button
          >
          <el-button
            :icon="Delete"
            type="danger"
            text
            @click="del(data.id, data.accountCounts)"
            >删除</el-button
          >
        </template>
      </MayTable>
      <Pagination
        :total="counts"
        @page="page"
        @psize="psize"
        :page="params.page"
        :psize="params.pageSize"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { getMessageBox } from "@/utils/utils";
import { RoleList, DelList, deleteAll } from "@/service/role/RoleApi";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const router = useRouter();
const counts = ref(0);
const params = reactive({
  page: 1,
  pageSize: 10,
});

const page = (val: number) => {
  params.page = val;
  getData();
};

const psize = (val: number) => {
  params.pageSize = val;
  getData();
};
const serveListIs = (val: any) => {
  const ids = val.map((item: any) => item.id);
  data.ids = ids;
};
// 批量删除
const delAll = async () => {
  let res = await getMessageBox("是否确认批量删除该角色", "删除后将不可恢复");
  if (!res) return ElMessage.info("取消删除");
  const del: any = await deleteAll(data.ids);
  if (del?.code === 10000) {
    ElMessage.success("删除成功");
    await getData();
  }
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
      label: "角色名称",
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
      label: "创建时间",
    },
  ],
});
//角色列表
const getData = async () => {
  let res: any = await RoleList(params).catch(() => {});
  if (res.code == 10000) {
    data.tableData = res.data.list;
    counts.value = res.data.counts;
  }
};
//删除角色
const del = async (id: number, accountCounts: number) => {
  console.log(accountCounts);

  const res = await getMessageBox("确定删除该角色吗?", "删除后不可恢复");
  if (res) {
    let sun: any = await DelList(id);
    if (sun.code == 10000) {
      getData();
      ElMessage.success("删除成功");
    }
  } else {
    ElMessage.info("取消删除");
  }
};
//新增
const addRole = () => {
  router.push({
    path: "/system/role-add",
  });
};
// 编辑
const edit = (id: number) => {
  router.push({
    path: `/system/role-edit/${id}`,
  });
};

onMounted(() => {
  getData();
});
</script>
<style lang="less" scoped></style>
