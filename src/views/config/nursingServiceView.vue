<template>
  <!-- 护理服务 -->
  <div class="app-container">
    <el-card style="max-width: 100%">
    <el-button type="primary" @click="add()">新增服务</el-button>
    <ServeDialog @close="close" v-if="isdialog" :data="servicedata" />
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate="{ data }">
        <el-button type="primary" text @click="emit(data)">编辑</el-button>
        <el-button type="primary" text @click="del(data.id)">删除</el-button>
      </template>
    </MayTable>
    <Pagination
      :total="total"
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
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import {
  ConfigNursingServiceList,
  delNursingService,
} from "@/service/config/ConfigApi";
import type { NursingServiceList } from "@/service/config/ConfigType";
import ServeDialog from "@/components/dialog/config/ServeDialog.vue";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const total = ref(0);
const params = reactive<NursingServiceList>({
  page: 1,
  pageSize: 5,
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

//删除
const del = async (id: number) => {
  let res = await getMessageBox("是否确认删除该服务", "删除后将不可恢复");
  console.log(1111, res);
  if (res) {
    let res: any = await delNursingService(id);
    if (res?.code === 10000) {
      getlist();
      ElMessage.success("删除成功");
    }
  } else {
    ElMessage.info("取消删除");
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

<style lang="less" scoped>
.el-button {
  margin-bottom: 20px;
}
</style>
