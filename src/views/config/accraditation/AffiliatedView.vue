<template>
  <div class="app-container">
    <el-card>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="机构名称：">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="管理姓名：">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>

      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 15px">
    <div style="margin: 10px 0">
      <el-button type="primary" @click="isdialog = true">新增</el-button>
      <AffDialog @close="close" v-if="isdialog" />
    </div>
    <!-- 表格 -->
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate>
        <el-button type="primary" text>修改</el-button>
        <el-button type="primary" text @click="del">删除</el-button>
      </template>
    </MayTable>
    <Pagination :total="50" />
  </el-card>
  </div>
  
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import AffiliatedView from "@/database/AffiliatedView.json";
import AffDialog from "@/components/dialog/care/AffDialog.vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
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
      label: "机构名称",
    },
    {
      prop: "address",
      label: "区域",
    },
    {
      prop: "manager",
      label: "管理员姓名",
    },
    {
      prop: "phone",
      label: "联系电话",
    },
    {
      prop: "username",
      label: "管理员账号",
    },
    {
      prop: "userpass",
      label: "管理员密码",
    },
    {
      prop: "creator",
      label: "创建人",
    },
    {
      prop: "addtime",
      label: "创建时间",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = AffiliatedView;
  }, 1000);
};
// 关闭弹窗
const close = () => {
  isdialog.value = false;
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
