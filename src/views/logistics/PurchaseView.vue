<template>
  <!-- 采购申请 -->
  <div class="app-container">
    <el-card>
      <div style="margin: 10px 0">
        <el-button type="success" @click="sond" :icon="Plus"
          >创建采购申请</el-button
        >
      </div>
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        autoWidth="350px"
      >
        <!-- eslint-disable-next-line vue/no-template-shadow -->
        <template #operate="{ data }">
          <el-button type="danger" :icon="Delete" text @click="del"
            >删除</el-button
          >
          <el-button
            type="primary"
            text
            :icon="DocumentCopy"
            v-if="data.state !== '已经发货'"
            @click="delivery(data.id)"
            >收货验货</el-button
          >
          <el-button
            type="primary"
            text
            v-if="data.state === '已经发货'"
            @click="getifno(data.id)"
            :icon="Tickets"
            >查看详情</el-button
          >
        </template>
      </MayTable>
      <Pagination
        @page="pageChenge"
        @psize="pageSizeChenge"
        :page="states.page"
        :psize="states.pageSize"
        :total="states.total"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { getPurchaseList } from "@/service/purchase/PurchaseApi";
import { Delete, DocumentCopy, Plus, Tickets } from "@element-plus/icons-vue";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const reteor = useRouter();
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "addTime",
      label: "创建时间",
    },
    {
      prop: "addAccountName",
      label: "申请人",
    },

    {
      prop: "counts",
      label: "品种",
    },
    {
      prop: "addAccountId",
      label: "实际采购成本",
    },
    {
      prop: "state",
      label: "状态",
    },
  ],
});
const states = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
// 采购申请列表
const getlist = async () => {
  let res: any = await getPurchaseList(states.value);
  if (res.code == 10000) {
    states.value.total = res.data.counts;
    data.tableData = res.data.list;
  }
};
// 分页
const pageChenge = (val: any) => {
  states.value.page = val;
  getlist();
};
const pageSizeChenge = (val: any) => {
  states.value.pageSize = val;
  getlist();
};
// 采购申请删除
const del = async () => {
  let res = await getMessageBox("是否确认删除该采购申请", "删除后将不可恢复");

  if (res) {
    ElMessage.success("删除成功");
  } else {
    ElMessage.info("取消删除");
  }
};
// 创建采购申请
const sond = () => {
  reteor.push("/logistics/add");
};
//收货验货
const delivery = (id: number) => {
  reteor.push("/logistics/details/" + id);
};
// 查看详情
const getifno = (id: any) => {
  reteor.push({
    path: "/logistics/check",
    query: {
      id: id,
    },
  });
};
onMounted(() => {
  getlist(); // 采购申请列表
});
</script>
<style lang="less" scoped>
.el-input {
  height: 40px;
}

.el-button {
  height: 40px;
  line-height: 40px;
}
</style>
