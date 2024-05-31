<template>
  <!-- dialog写在medicalcare文件夹下 -->
  <el-card>
    <el-form :model="form" label-width="130px" label-position="left">
      <el-form-item label="登记日期："> 2020-03-03 </el-form-item>
      <el-form-item label="家属姓名：" class="formitem">张三 </el-form-item>
      <el-form-item label="经办人：" class="formitem">李四 </el-form-item>
      <el-form-item label="药品：" class="formitem">
        <MayTable
          :tableData="data.tableData"
          :tableItem="data.tableItem"
          :isoperate="false"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script lang="ts" setup>
import { reactive, onMounted, defineAsyncComponent } from "vue";

const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
import AffiliatedView from "@/database/AffiliatedView.json";

const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "药品名称",
    },
    {
      prop: "address",
      label: "数量",
    },
    {
      prop: "manager",
      label: "有效期",
    },
    {
      prop: "phone",
      label: "剂量",
    },
    {
      prop: "phone",
      label: "服法",
    },
  ],
});
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});
// 关闭弹窗
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
.content {
  width: 80%;
  white-space: normal;
}

.formitem {
  align-items: flex-start;
}
</style>
