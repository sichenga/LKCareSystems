<template>
  <div style="margin: 10px 0">
    <el-button type="primary" @click="isdialog = true">新增家属</el-button>
    <RelationDialog @close="close" v-if="isdialog" :data="editdata" />
  </div>
  <!-- 表格 -->
  <MayTable :tableData="ruleForm.family" :tableItem="data.tableItem">
    <template #operate="{ data, index }">
      <el-button type="primary" text @click="edit(data, index)">编辑</el-button>
      <el-button type="primary" text @click="del(index)">删除</el-button>
    </template>
  </MayTable>
  <Pagination :total="total" />
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent, inject } from "vue";
import RelationDialog from "@/components/dialog/RelationDialog.vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import type { AddElderlyRequest } from "@/service/old/OldType";
const ruleForm = inject<AddElderlyRequest>("ruleForm")!;
const isdialog = ref(false);
// 编辑家属数据
const editdata = ref({});
const total = ref(ruleForm.family.length);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "姓名",
    },
    {
      prop: "gender",
      label: "性别",
    },
    {
      prop: "idCard",
      label: "身份证号码",
    },
    {
      prop: "mobile",
      label: "联系电话",
    },
    {
      prop: "address",
      label: "联系地址",
    },
    {
      prop: "relation",
      label: "与老人关系",
    },
  ],
});

// 关闭弹窗
const close = () => {
  isdialog.value = false;
  if (editdata.value) {
    editdata.value = {};
    total.value = ruleForm.family.length;
  }
};
// 删除
const del = async (index: number) => {
  let res = await getMessageBox("是否确认删除该家属", "删除后将不可恢复");
  console.log(11112, res);
  if (res) {
    ruleForm.family.splice(index, 1);
    total.value = ruleForm.family.length;
    ElMessage.success("删除成功");
  } else {
    ElMessage.info("取消删除");
  }
};

// 编辑
const edit = (data: any, index: number) => {
  editdata.value = { data, index };
  isdialog.value = true;
  // console.log(1111, editdata.value)
};
onMounted(() => {});
</script>
<style lang="less" scoped>
.el-input {
  height: 40px;
}
.el-button {
  height: 40px;
  line-height: 40px;
}
.demo-ruleForm-but {
  margin-left: 660px;
  margin-top: 60px;
  .el-button {
    width: 100px;
    height: 40px;
  }
}
</style>
