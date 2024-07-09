<template>
  <!-- 采购申请 -->
  <!-- 查询 -->
  <div class="app-container">
    <el-card>
      <el-form
        ref="Refform"
        :inline="true"
        :model="params"
        class="demo-form-inline"
      >
        <el-form-item label="机构名称：" prop="name">
          <el-select v-model="params.companyId" clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in data.companyId"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="期望到货日期：" prop="beginDate">
          <MayDateTimePicker
            :end-time="params.endDate"
            :isrange="true"
            :start-time="params.beginDate"
            @change="timeChange"
          />
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="params.state" clearable placeholder="请选择">
            <el-option label="已经发货" value="已经发货" />
            <el-option label="未发货" value="未发货" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :icon="Search"
            >查询</el-button
          >
          <el-button @click="onReset" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table">
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        autoWidth="180px"
      >
        <!-- eslint-disable-next-line vue/no-template-shadow -->
        <template #operate="{ data }">
          <el-button
            link
            size="small"
            type="primary"
            :icon="Tickets"
            @click="details(data.id)"
            >查看详情</el-button
          >
        </template>
      </MayTable>
      <!-- 分页 -->
      <Pagination
        :page="params.page"
        :psize="params.pageSize"
        :total="data.total"
        @page="page"
        @psize="psize"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { Tickets, Search, Refresh } from "@element-plus/icons-vue";
import { defineAsyncComponent, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { PurchaseList, purchase } from "@/service/food/FoodApi";
import type { Purchase } from "@/service/food/FoodType";
import { companylist } from "@/service/Organization/OrganizationApi";
import MayDateTimePicker from "@/components/timepicker/MayDateTimePicker.vue";
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const data = reactive({
  companyId: [] as any,
  total: undefined,
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
      prop: "companyName",
      label: "机构名称",
    },
    {
      prop: "counts",
      label: "品种数",
    },
    {
      prop: "receiveTime",
      label: "期望到货日期",
    },
    {
      prop: "state",
      label: "状态",
    },
  ],
});
const params = reactive<Purchase>({
  pageSize: 10,
  page: 1,
  companyId: "",
  state: "",
  beginDate: "",
  endDate: "",
});
// 采购申请列表
const getlist = async () => {
  const res: any = await PurchaseList(params).catch(() => {});
  console.log("采购申请列表", res);
  if (res.code == 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
  }
};
// 机构名称
const getdata = async () => {
  const res: any = await companylist({ page: 1, pageSize: 10 });
  console.log("机构名称", res);
  if (res.code == 10000) {
    data.companyId = res.data.list;
  }
};
onMounted(() => {
  getlist();
  getdata();
});

// 查看详情
const details = (id: number) => {
  console.log("查看详情");
  router.push(`/diet/purchase-detail/${id}`);
};
// 重置
const Refform = ref();
const onReset = () => {
  // if (!formEl) return
  Refform.value?.resetFields();
  getlist();
};

// 选择时间
const timeChange = (val: any) => {
  params.beginDate = val[0];
  params.endDate = val[1];
};

const onSubmit = () => {
  getlist();
};
// 分页
const page = (val: number) => {
  params.page = val;
  getlist();
};
const psize = (val: number) => {
  params.pageSize = val;
  getlist();
};
</script>

<style lang="less" scoped>
.table {
  margin-top: 20px;
}
</style>
<style>
.demo-form-inline {
  --el-input-width: 220px;
}

.el-select {
  width: 180px;
}

.el-card {
  width: 100%;
}
</style>
