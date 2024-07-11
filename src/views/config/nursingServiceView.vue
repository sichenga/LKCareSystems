<template>
  <!-- 护理服务 -->
  <div class="app-container">
    <el-card style="max-width: 100%">
      <el-button
        type="success"
        @click="add()"
        :icon="Plus"
        style="margin-bottom: 15px"
        >新增服务</el-button
      >
      <el-button
        type="danger"
        @click="del(delAllData)"
        :icon="Delete"
        :disabled="isdisabled"
        style="margin-bottom: 15px"
        >批量删除</el-button
      >
      <ServeDialog v-if="isdialog" :data="servicedata" @close="close" />
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        autoWidth="200px"
        :isMultiple="true"
        @serve-list-is="serveListIs"
      >
        <template #operate="{ data }">
          <el-button text type="primary" :icon="Edit" @click="emit(data)"
            >编辑</el-button
          >
          <el-button :icon="Delete" text type="danger" @click="del(data.id)"
            >删除</el-button
          >
        </template>
      </MayTable>
      <Pagination
        :page="params.page"
        :psize="params.pageSize"
        :total="total"
        @page="getpage"
        @psize="getpsize"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import {
  ConfigNursingServiceList,
  delNursingService,
  delNursingServiceBatch,
} from "@/service/config/ConfigApi";
import type { NursingServiceList } from "@/service/config/ConfigType";
import ServeDialog from "@/components/dialog/config/ServeDialog.vue";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";

const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const total = ref(0);
const params = reactive<NursingServiceList>({
  page: 1,
  pageSize: 10,
});
//弹出框
const isdialog = ref(false);
//删除
const servicedata = ref({});
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
      width: "60",
    },
    {
      prop: "name",
      label: "服务名称",
      width: "100",
    },
    {
      prop: "content",
      label: "服务描述",
    },
  ],
});
// 护理列表
const getlist = async () => {
  let res: any = await ConfigNursingServiceList(params);
  console.log("护理列表", res);
  if (res?.code === 10000) {
    total.value = res.data.counts;
    data.tableData = res.data.list;
  }
};

//弹出框
const close = (isclose: boolean) => {
  if (isclose) {
    getlist();
  }
  isdialog.value = false;
};

// 新增
const add = () => {
  isdialog.value = true;
  servicedata.value = {};
};

// 编辑
const emit = (data: any) => {
  console.log(data);
  servicedata.value = data;
  isdialog.value = true;
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
//删除
const del = async (id: number) => {
  let res = await getMessageBox("是否确认删除该服务", "删除后将不可恢复");
  // console.log(1111, res);
  if (!res) {
    return ElMessage.info("取消删除");
  }
  let del: any;
  if (Array.isArray(id)) {
    del = await delNursingServiceBatch(id);
  } else {
    del = await delNursingService(id);
  }
  if (del?.code === 10000) {
    getlist();
    ElMessage.success("删除成功");
  }
};

// 分页
const getpage = (page: number) => {
  params.page = page;
  getlist();
};
const getpsize = (psize: number) => {
  params.pageSize = psize;
  getlist();
};

onMounted(() => {
  getlist();
});
</script>

<style lang="less" scoped></style>
