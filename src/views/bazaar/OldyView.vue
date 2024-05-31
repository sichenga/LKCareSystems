<template>
  <!-- 老人管理 -->
  <el-card>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="老人姓名:">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="身份证号码:">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="床位:">
        <el-select v-model="formInline.region">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="入住状况:">
        <el-select v-model="formInline.region">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 15px">
    <div style="margin: 10px 0">
      <el-button type="primary" @click="add">新增老人</el-button>
    </div>
    <!-- 表格 -->
    <MayTable
      :tableData="data.tableData"
      :tableItem="data.tableItem"
      :identifier="identifier"
    >
      <template #operate>
        <el-button type="primary" text>编辑</el-button>
        <el-button type="primary" text>档案管理</el-button>
        <el-button type="primary" text>排班管理</el-button>
        <el-button type="primary" text @click="del">删除</el-button>
        <el-button type="primary" text>计划任务</el-button>
      </template>
    </MayTable>
    <Pagination :total="50" />
  </el-card>
</template>
<script lang="ts" setup>
import { reactive, onMounted, defineAsyncComponent } from "vue";
import AffiliatedView from "@/database/AffiliatedView.json";
import { useRouter } from "vue-router";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
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
const identifier = "administration";
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
    {
      prop: "username",
      label: "状态",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = AffiliatedView;
  }, 1000);
};

// 删除
const del = async () => {
  let res = await getMessageBox("是否删除老人？", "删除后将不可恢复");
  console.log(11112, res);
  if (res) {
    ElMessage.success("删除成功");
  } else {
    ElMessage.info("取消删除");
  }
};
const add = () => {
  router.push("/dashboard/addold");
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

.el-form--inline .el-form-item {
  width: 270px;
}
</style>
