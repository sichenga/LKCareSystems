<template>
  <div>
    <!-- 用药计划 -->
    <!-- dialog写在medicalcare文件夹下 -->
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="老人：">
          <el-input v-model="formInline.user" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 15px">
      <!-- 表格 -->
      <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
        <template #operate>
          <el-button text type="primary" @click="projectinfo"
            >用药计划设置</el-button
          >
        </template>
      </MayTable>
      <Pagination :total="50" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive } from "vue";

import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);

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
      prop: "name",
      label: "老人姓名",
    },
    {
      prop: "address",
      label: "用药品种数",
    },
  ],
});
const getlist = () => {
  console.log(11);
};

// 用药计划设置
const projectinfo = () => {
  router.push("/medicalcare/medicineplan/planset");
};

// 删除
const del = async () => {
  let res = await getMessageBox("是否确认删除该角色", "删除后将不可恢复");
  console.log(11112, res);
  if (res) {
    ElMessage.success("删除成功");
  } else {
    ElMessage.info("取消删除");
  }
};
onMounted(() => {
  getlist();
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
