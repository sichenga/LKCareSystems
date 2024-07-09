<template>
  <div class="app-container">
    <!-- 地址管理 -->
    <LocationDialog v-if="isdialog" @close="close" :data="addressdata" />
    <el-card>
      <div style="margin: 10px 0">
        <el-button type="primary" @click="add">新增地址</el-button>
      </div>
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        autoWidth="180px"
      >
        <template #operate="{ data }">
          <el-button type="primary" text @click="edit(data)">编辑</el-button>
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
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { addresslist, addressdelete } from "@/service/address/AddressApi";
import type { AddressList } from "@/service/address/AddressType";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import LocationDialog from "@/components/dialog/care/LocationDialog.vue";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const isdialog = ref(false);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "巡检地点",
    },
    {
      prop: "qrcode",
      label: "二维码",
    },
  ],
});
const addressdata = ref({});
const total = ref(0);
const params = reactive<AddressList>({
  page: 1,
  pageSize: 10,
});
// 地址管理
const getlist = async () => {
  let res: any = await addresslist(params).catch(() => {});
  console.log("地址列表", res);
  if (res?.code === 10000) {
    total.value = res.data.counts;
    data.tableData = res.data.list;
  }
};

// 关闭弹窗
const close = (isclose: boolean) => {
  if (isclose === true) {
    getlist();
  }
  isdialog.value = false;
};

// 新增
const add = () => {
  isdialog.value = true;
  addressdata.value = {};
};
// 编辑
const edit = (data: any) => {
  addressdata.value = data;
  isdialog.value = true;
};

// 删除
const del = async (id: number) => {
  let res = await getMessageBox("是否确认删除该地址", "删除后将不可恢复");
  console.log(11112, res);
  if (res) {
    let res: any = await addressdelete(id);
    if (res?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
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
const getpsize = (pageSize: number) => {
  params.pageSize = pageSize;
  getlist();
};
onMounted(() => {
  getlist();
});
</script>
<style lang="less" scoped></style>
