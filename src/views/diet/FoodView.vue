<template>
  <!-- 食材管理 -->
  <div class="app-container">
    <div class="box">
      <el-button
        type="success"
        :icon="Plus"
        @click="isdialog = true"
        style="margin-bottom: 15px"
        >新增</el-button
      >
      <el-button
        style="margin-bottom: 15px"
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
        style="margin-bottom: 15px"
        v-if="ids.length <= 0"
        >批量删除</el-button
      >

      <FoodDialog v-if="isdialog" :foodid="foodid" @close="close" />
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        :isMultiple="true"
        @serve-list-is="serveListIs"
        autoWidth="350px"
      >
        <!-- eslint-disable-next-line vue/no-template-shadow -->
        <template #operate="{ data }">
          <el-button
            link
            type="primary"
            :icon="Edit"
            @click="handleEdit(data.id)"
            >编辑
          </el-button>
          <el-button
            link
            type="danger"
            :icon="Delete"
            @click="handleDelete(data.id)"
            >删除
          </el-button>
          <el-button
            link
            type="primary"
            :icon="Tickets"
            @click="priceUpdate(data.id)"
            >价格更新
          </el-button>
          <el-button
            link
            type="primary"
            :icon="DataLine"
            @click="priceAnalysis(data.id)"
            >价格分析
          </el-button>
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

      <!-- 价格更新 -->
      <PriceDialog v-if="isprice" :priceid="priceid" @close="close" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Edit, DataLine, Tickets, Plus } from "@element-plus/icons-vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import FoodDialog from "@/components/dialog/FoodDialog.vue";
import PriceDialog from "@/components/dialog/diet/PriceDialog.vue";
import { useRouter } from "vue-router";
import { Fooddelete, FoodList, FoodaddAll } from "@/service/food/FoodApi";
import type { Supplier } from "@/service/food/FoodType";

const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const isdialog = ref(false);
const isprice = ref(false);
const total = ref(0);
// 价格更新fondid
const priceid = ref(0);
// 编辑食材fondid
const foodid = ref(0);
const params = reactive<Supplier>({
  total: 0,
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
      label: "物料名称",
    },
    {
      prop: "unit",
      label: "单位",
    },
    {
      prop: "supplierName",
      label: "供应商",
    },
    {
      prop: "wholePrice",
      label: "批发价",
    },
    {
      prop: "sellPrice",
      label: "零售价",
    },
    {
      prop: "purchasePrice",
      label: "采购价",
    },
    {
      prop: "updateTime",
      label: "价格更新日期",
    },
  ],
});
const getlist = async () => {
  let res: any = await FoodList(params);
  console.log("食材管理", res);
  if (res?.code === 10000) {
    total.value = res.data.counts;
    data.tableData = res.data.list;
  }
};

// 关闭弹窗
const close = (isrefresh: boolean) => {
  if (isrefresh) {
    getlist();
  }
  isdialog.value = false;
  isprice.value = false;
};
onMounted(() => {
  getlist();
});
// 编辑
const handleEdit = (id: any) => {
  console.log("编辑", id);
  foodid.value = id;
  isdialog.value = true;
};
// 删除
const handleDelete = async (id: number) => {
  let res = await getMessageBox("是否确认删除该食材", "删除后将不可恢复");
  if (res) {
    const del: any = await Fooddelete(id);
    if (del?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
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
    const del: any = await FoodaddAll(ids.value);
    if (del?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
    }
  } else {
    ElMessage.info("取消删除");
  }
};

// 价格更新
const priceUpdate = (id: number) => {
  console.log("价格更新", id);
  priceid.value = id;
  isprice.value = true;
};
// 价格分析
const priceAnalysis = (id: number) => {
  console.log("价格分析", id);
  router.push({
    path: "/diet/food-price",
    query: {
      id,
    },
  });
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
.box {
  padding: 20px;
  background-color: #fff;

  .el-table {
    margin-top: 40px;
  }
}
</style>
