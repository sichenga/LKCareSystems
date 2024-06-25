<template>
  <div class="app-container">
    <!-- 外出申请  外出登记-->
    <el-card>
      <el-form
        ref="Refgoout"
        :inline="true"
        :model="params"
        class="demo-form-inline"
      >
        <el-form-item label="老人姓名：" prop="name">
          <el-input v-model="params.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="审批状态：" prop="state">
          <el-select
            v-model="params.state"
            placeholder="请选择"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in statelist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：" prop="beginDate">
          <MayDateTimePicker
            :endtime="params.endDate"
            :statetime="params.beginDate"
            @change="timeSelect"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sond">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 15px">
      <div style="margin: 10px 0">
        <el-button type="primary" @click="add">新增外出</el-button>
        <OldSelectDialog
          v-if="dialogVisible"
          :toPath="topath"
          @close="handClose"
        />
        <AffDialog v-if="isdialog" @close="close" />
      </div>
      <!-- 表格 -->
      <MayTable
        :identifier="identifier"
        :tableData="data.tableData"
        :tableItem="data.tableItem"
      >
        <template #operate="{ data }">
          <el-button text type="primary" @click="compile(data.id)"
            >编辑</el-button
          >
          <el-button text type="primary" @click="del(data.id)">删除</el-button>
          <el-button text type="primary" @click="btn(data.id)"
            >查看详情</el-button
          >
        </template>
      </MayTable>
      <Pagination
        :page="params.page"
        :psize="params.pageSize"
        :total="total"
        @page="handlPage"
        @pszie="handlPsize"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import AffDialog from "@/components/dialog/care/AffDialog.vue";
import { useRouter } from "vue-router";
import { DelgetList, getList } from "@/service/care/gooutApi";
import type { Goout } from "@/service/care/gooutType";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import OldSelectDialog from "@/components/dialog/OldSelect/OldSelectDialog.vue";
import MayDateTimePicker from "@/components/timepicker/MayDateTimePicker.vue";

const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const topath = ref("/care/add");
const Refgoout = ref();
const identifier = "GoOut";
const isdialog = ref(false);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "elderlyName",
      label: "老人姓名",
    },
    {
      prop: "begName",
      label: "床位号",
    },
    {
      prop: "addAccountName",
      label: "陪同人员姓名",
    },
    {
      prop: "mobile",
      label: "陪同人员手机号",
    },
    {
      prop: "startTime",
      label: "外出时间",
    },
    {
      prop: "state",
      label: "审批状态",
    },
  ],
});
//审批状态
const statelist = [
  { value: 0, label: "待审批" },
  { value: 1, label: "审批通过" },
  { value: 2, label: "审批拒绝" },
] as any;
const params = reactive<Goout>({
  page: 1,
  pageSize: 5,
  name: "", //老人姓名
  accountId: null, //登记人iD
  state: null, //状态
  beginDate: "", //开始时间yyyy-MM-dd
  endDate: "", //结束时间yyyy-MM-dd
});
// 重置
const reset = () => {
  params.page = 1;
  Refgoout.value?.resetFields();
  params.endDate = "";
  getlistData();
};

//外出登记列表
const total = ref(0);
const getlistData = async () => {
  let res: any = await getList(params);

  if (res?.code == 10000) {
    data.tableData = res.data.list;
    total.value = res.data.counts;
  }
};
// 关闭弹窗
const close = () => {
  isdialog.value = false;
};

// 新增外出
const dialogVisible = ref(false);
const handClose = (val: any) => {
  dialogVisible.value = val;
  topath.value = "/care/add";
};
const add = () => {
  // router.push('/care/goout/add')
  dialogVisible.value = true;
};
//编辑外出
const compile = (id: number) => {
  router.push({
    path: `/care/edit/${id}`,
  });
};
// 详情
const btn = (id: number) => {
  router.push({
    path: "/care/details/id",
    query: {
      id: id,
    },
  });
};
// 创建时间
const timeSelect = (val: any) => {
  params.beginDate = val[0];
  params.endDate = val[1];
};
// 分页
const handlPage = (val: any) => {
  params.page = val;
  getlistData(); //外出登记列表
};
const handlPsize = (val: any) => {
  params.pageSize = val;
  getlistData(); //外出登记列表
};
// 删除
const del = async (id: number) => {
  let res = await getMessageBox("是否确认删除此外出申请", "删除后将不可恢复");
  if (res) {
    let _res: any = await DelgetList(id);
    if (_res.code == 10000) {
      getlistData(); //外出登记列表
      ElMessage.success("删除成功");
    }
  } else {
    ElMessage.info("取消删除");
  }
};
// 查询
const sond = () => {
  params.page = 1;
  getlistData(); //外出登记列表
};

onMounted(() => {
  getlistData(); //外出登记列表
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
