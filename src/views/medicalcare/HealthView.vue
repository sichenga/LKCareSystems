<template>
  <div>
    <!-- 健康档案 -->
    <!-- dialog写在medicalcare文件夹下 -->
    <el-card style="max-width: 100%">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="老人">
          <el-input v-model="formInline.user" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="床位:">
          <el-select v-model="formInline.region" placeholder="请选择" clearable>
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"> 查询 </el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="max-width: 100%" class="card">
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        @identifier="identifier"
      >
        <template #operate>
          <el-button type="primary" text>健康档案管理</el-button>
        </template>
      </MayTable>
      <Pagination :total="50" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import AffiliatedView from "@/database/AffiliatedView.json";
const identifier: any = ref(0);
const formInline = reactive({
  user: "",
  region: "",
  date: "",
});
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "image",
      label: "头像",
    },
    {
      prop: "name",
      label: "老人姓名",
    },
    {
      prop: "address",
      label: "性别",
    },
    {
      prop: "manager",
      label: "身份证号",
    },
    {
      prop: "phone",
      label: "床位",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = AffiliatedView;
  }, 1000);
};
onMounted(() => {
  getlist();
});
</script>
<style lang="less" scoped>
.card {
  margin-top: 20px;
}

.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
