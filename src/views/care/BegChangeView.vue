<template>
  <div>
    <!-- 床位更换 -->
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="老人姓名：">
          <el-input v-model="formInline.user" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="身份证号码：">
          <el-input v-model="formInline.user" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="性别：">
          <el-select
            v-model="formInline.sex"
            clearable
            placeholder="请选择"
            style="width: 240px"
            size="large"
          >
            <el-option
              v-for="item in sexlist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审批状态：">
          <el-select
            v-model="formInline.state"
            clearable
            placeholder="请选择"
            style="width: 240px"
            size="large"
          >
            <el-option
              v-for="item in data.statelist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
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
        <el-button type="primary" @click="isdialog = true"
          >新增床位更换申请</el-button
        >
        <BedDialog v-if="isdialog" @close="close" />
      </div>
      <!-- 表格 -->
      <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
        <template #operate>
          <el-button type="primary" text>编辑</el-button>
          <el-button type="primary" text @click="getinfo">查看详情</el-button>
        </template>
      </MayTable>
      <Pagination :total="50" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import AffiliatedView from "@/database/AffiliatedView.json";
import { useRouter } from "vue-router";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const BedDialog = defineAsyncComponent(
  () => import("@/components/dialog/care/BedDialog.vue")
);
const router = useRouter();
const formInline = reactive({
  user: "",
  region: "",
  date: "",
  sex: "",
  state: "",
});
const sexlist = [
  { label: "男", value: "男" },
  { label: "女", value: "女" },
];
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
      label: "原床位",
    },
    {
      prop: "username",
      label: "变更后床位",
    },
    {
      prop: "userpass",
      label: "申请人",
    },
    {
      prop: "creator",
      label: "申请日期",
    },
    {
      prop: "addtime",
      label: "状态",
    },
  ],
  statelist: [
    { label: "待审核", value: "待审核" },
    { label: "已通过", value: "已通过" },
    { label: "已拒绝", value: "已拒绝" },
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
// 跳转详情
const getinfo = () => {
  router.push("/care/beg-details");
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
