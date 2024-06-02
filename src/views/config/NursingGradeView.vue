<template>
  <!-- 护理等级 -->
  <div class="app-container">
    <el-card style="max-width: 100%">
    <el-button type="primary" @click="isdialog = true">新增护理等级</el-button>
    <AddedlevelDialog @close="close" v-if="isdialog" />
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate>
        <el-button type="primary" text>编辑</el-button>
        <el-button type="primary" text @click="del">删除</el-button>
        <el-button type="primary" text @click="allocation"
          >配置护理项目</el-button
        >
      </template>
    </MayTable>
  </el-card>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, reactive, defineAsyncComponent, onMounted } from "vue";
import AddedlevelView from "@/database/AddedlevelView.json";
import AddedlevelDialog from "@/components/dialog/config/AddedlevelDialog.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);

const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
      width: "60",
    },
    {
      prop: "grade",
      label: "护理等级",
      width: "200",
    },
    {
      prop: "oldman",
      label: "关联老人数",
      width: "200",
    },
    {
      prop: "describe",
      label: "服务描述",
      width: "200",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = AddedlevelView;
  }, 1000);
};
onMounted(() => {
  getlist();
});
//弹出框
const isdialog = ref(false);
const close = () => {
  isdialog.value = false;
};
//删除
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
const del = async () => {
  let res = await getMessageBox("是否确认删除该服务等级", "删除后将不可恢复");
  console.log(1111, res);
  if (res) {
    ElMessage.success("删除成功");
  } else {
    ElMessage.info("取消删除");
  }
};
//跳转到配置护理项目
const allocation = () => {
  router.push({
    name: "Configuration",
  });
};
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 20px;
}
</style>
