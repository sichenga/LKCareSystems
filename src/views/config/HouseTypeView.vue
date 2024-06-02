<template>
  <!-- 房型管理 -->
  <div class="app-container">
    <el-card style="max-width: 100%">
    <el-button type="primary" @click="add">新增房间类型</el-button>
    <ManageDialog @close="close" v-if="isdialog" :dataget="dataget" />
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate="{ data }">
        <el-button type="primary" size="small" link @click="handleEdit(data)"
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
      :total="data.total"
      :page="params.page"
      :psize="params.pageSize"
      @page="getpage"
      @psize="getpsize"
    />
  </el-card>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, reactive, defineAsyncComponent, onMounted } from "vue";
import { HousetypeList, HousetypeDelete } from "@/service/config/ConfigApi";
import type { Housetypeparams } from "@/service/config/ConfigType";
import ManageDialog from "@/components/dialog/config/ManageDialog.vue";
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
      label: "房间名称",
    },
  ],
});
const params = reactive<Housetypeparams>({
  page: 1,
  pageSize: 5,
});
const getlist = async () => {
  const res: any = await HousetypeList(params);
  console.log("房间类型列表", res);
  if (res.code == 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
  }
};
// 编辑
const dataget = ref<any>([]);
const handleEdit = (data: any) => {
  console.log("编辑", data);
  isdialog.value = true;
  dataget.value = data;
};
onMounted(() => {
  getlist();
});
//弹出框
const isdialog = ref(false);
const close = (val: any) => {
  if (val) {
    getlist();
  }
  isdialog.value = false;
};
//删除
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
const handleDelete = async (id: number) => {
  let res = await getMessageBox("是否确认删除该食材", "删除后将不可恢复");
  if (res) {
    const del: any = await HousetypeDelete(id);
    console.log("删除", del);
    if (del?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
    }
  } else {
    ElMessage.info("取消删除");
  }
};
// 新增
const add = () => {
  dataget.value = {};
  // 打开对话框
  isdialog.value = true;
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
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 20px;
}
</style>
