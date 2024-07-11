<template>
  <!-- 房型管理 -->
  <div class="app-container">
    <el-card style="max-width: 100%">
      <el-button type="success" class="m-b" :icon="Plus" @click="add"
        >新增房间类型</el-button
      >
      <el-button
        type="danger"
        class="m-b"
        :icon="Delete"
        :disabled="isdisabled"
        @click="handleDelete(delAllData)"
        >批量删除</el-button
      >
      <ManageDialog v-if="isdialog" :dataget="dataget" @close="close" />
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        @serve-list-is="serveListIs"
        :isMultiple="true"
      >
        <template #operate="{ data }">
          <el-button link type="primary" :icon="Edit" @click="handleEdit(data)"
            >编辑
          </el-button>
          <el-button
            link
            type="danger"
            :icon="Delete"
            @click="handleDelete(data.id)"
            >删除
          </el-button>
        </template>
      </MayTable>
      <!-- 分页 -->
      <Pagination
        :page="params.page"
        :psize="params.pageSize"
        :total="data.total"
        @page="getpage"
        @psize="getpsize"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import {
  HousetypeDelete,
  HousetypeDeleteBatch,
  HousetypeList,
} from "@/service/config/ConfigApi";
import type { Housetypeparams } from "@/service/config/ConfigType";
import ManageDialog from "@/components/dialog/config/ManageDialog.vue";
//删除
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";

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
  pageSize: 10,
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
// 批量删除按钮是否可以点击
const isdisabled = ref(true);
// 批量删除数据
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
// 删除
const handleDelete = async (id: number) => {
  let res = await getMessageBox("是否确认删除该食材", "删除后将不可恢复");
  if (!res) {
    return ElMessage.info("取消删除");
  }
  let del: any;
  if (Array.isArray(id)) {
    del = await HousetypeDeleteBatch(id);
  } else {
    del = await HousetypeDelete(id);
  }

  if (del?.code === 10000) {
    ElMessage.success("删除成功");
    await getlist();
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

<style lang="less" scoped></style>
