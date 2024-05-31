<template>
  <!-- 合作组织管理 -->
  <!-- dialog写在market文件夹下 -->
  <el-card style="max-width: 100%">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="合作组织:">
        <el-input v-model="formInline.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="组织类型：">
        <el-select v-model="formInline.region" placeholder="请选择">
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
  <el-card style="max-width: 100%" class="card">
    <!-- 按钮 -->
    <div style="margin-bottom: 30px">
      <el-button type="primary" @click="add">新增合作组织</el-button>
      <el-button @click="points">积分奖励设置</el-button>
    </div>
    <!-- 表格 -->
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate="{ data }">
        <el-button type="primary" size="small" text @click="handleEdit(data)"
          >编辑</el-button
        >
        <el-button
          type="primary"
          size="small"
          text
          @click="handleDelete(data.id)"
          >删除</el-button
        >
      </template>
    </MayTable>
    <Pagination :total="50" />
    <!-- 新增 -->
    <CooperativeDialog @close="close" v-if="isdialog" />
    <!-- 积分奖励 -->
    <RewarDialog @close="close" v-if="isdshow" />
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import CooperativeView from "@/database/CooperativeView.json";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import CooperativeDialog from "@/components/dialog/market/CooperativeDialog.vue";
import RewarDialog from "@/components/dialog/market/Rewardialog.vue";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import { useRouter } from "vue-router";
const router = useRouter();
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
      prop: "title",
      label: "合作组织",
    },
    {
      prop: "feedback",
      label: "组织类型",
    },
    {
      prop: "complaint",
      label: "联系人",
    },
    {
      prop: "addTime",
      label: "联系方式",
    },
    {
      prop: "executor",
      label: "推荐人次",
    },
    {
      prop: "completiontime",
      label: "推荐积分",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = CooperativeView;
  }, 1000);
};
onMounted(() => {
  getlist();
});
//弹出框
const isdialog = ref(false);
const isdshow = ref(false);
const close = (val: any) => {
  if (val) {
    getlist();
  }
  isdialog.value = false;
  isdshow.value = false;
};
// 编辑
const handleEdit = (data: any) => {
  console.log("编辑", data);
};
//删除
const handleDelete = async (id: number) => {
  let res = await getMessageBox("是否确认删除该合作组织", "删除后将不可恢复");
  if (res) {
    ElMessage.success("删除成功");
  } else {
    ElMessage.info("取消删除");
  }
};
// 新增合作组织
const add = () => {
  isdialog.value = true;
};
// 积分奖励
const points = () => {
  isdshow.value = true;
};
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
