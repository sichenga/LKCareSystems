<template>
  <!-- 岗位管理 -->
  <div class="box">
    <el-button style="margin-bottom: 30px" type="primary" @click="add"
      >新增岗位</el-button
    >
    <!-- 表格 -->
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate="{ data }">
        <el-button type="primary" size="small" link @click="handleEdit(data.id)"
          >编辑</el-button
        >
        <el-button
          type="primary"
          size="small"
          link
          @click="handleDelete(data.id)"
          >删除</el-button
        >
      </template>
    </MayTable>
    <!-- 分页 -->
    <Pagination
      :total="total"
      :page="params.page"
      :psize="params.pageSize"
      @page="getpage"
      @psize="getpsize"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import { RoleList, DelList } from "@/service/role/RoleApi";
import type { Roletype } from "@/service/role/Roletype";
const total = ref(0);
const params = reactive<Roletype>({
  page: 1,
  pageSize: 5,
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
  router.push("/personel/position/add");
};
// 编辑
const handleEdit = (id: number) => {
  console.log("编辑", id);
  router.push({
    path: `/personel/position/edit/${id}`,
  });
};
// 删除
const handleDelete = async (id: any) => {
  console.log("删除", id);
  let res = await getMessageBox("是否确认删除该岗位", "删除后将不可恢复");
  if (res) {
    let res: any = await DelList(id);
    if (res?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
    }
  } else {
    ElMessage.info("取消删除");
  }
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

<style scoped lang="less">
.box {
  background-color: #fff;
  padding: 20px;
}
</style>
