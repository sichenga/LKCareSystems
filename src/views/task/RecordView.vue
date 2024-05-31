<template>
  <!-- 交接记录 -->
  <el-card>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="任务名称：">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="提交人名称：">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="接收人姓名：">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="联系方式：">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="接收状态：">
        <el-select
          v-model="formInline.user"
          clearable
          placeholder="请选择"
          size="large"
        >
          <el-option
            v-for="item in data.statelist"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提交时间：">
        <TimePicker style="width: 300px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button>查询</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 15px">
    <!-- 表格 -->
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate>
        <el-button type="primary" text @click="detail">查看明细</el-button>
      </template>
    </MayTable>
    <Pagination :total="50" />
  </el-card>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import AffiliatedView from "@/database/AffiliatedView.json";
import { useRouter } from "vue-router";
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const TimePicker = defineAsyncComponent(
  () => import("@/components/timepicker/MayTimePicker.vue")
);
const formInline = reactive({
  user: "",
  region: "",
  date: "",
});
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
      label: "提交时间",
    },
    {
      prop: "address",
      label: "提交人",
    },
    {
      prop: "manager",
      label: "接收人",
    },
    {
      prop: "phone",
      label: "接收人联系方式",
    },
    {
      prop: "username",
      label: "任务数量",
    },
  ],
  statelist: [
    {
      id: 1,
      name: "待接收",
    },
    {
      id: 2,
      name: "拒绝",
    },
    {
      id: 3,
      name: "已接收",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = AffiliatedView;
  }, 1000);
};
// 查看明细
const detail = () => {
  router.push("/task/record-details");
};
onMounted(() => {
  getlist();
});
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
  height: 40px;
}

.el-select {
  width: 300px !important;
}

.el-button {
  height: 40px;
  line-height: 40px;
}
</style>
