<template>
  <div class="app-container">
    <el-card>
      <!-- 潜在客户 -->
      <el-form
        ref="Refcustomer"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="老人姓名：" prop="name">
          <el-input
            v-model="formInline.name"
            clearable
            placeholder="请输入老人姓名"
          />
        </el-form-item>
        <el-form-item label="身份证号：" prop="idCard">
          <el-input
            v-model="formInline.idCard"
            clearable
            placeholder="请输入身份证号"
          />
        </el-form-item>
        <el-form-item label="创建日期:" prop="beginDate">
          <MayDateTimePicker
            :endtime="formInline.endDate"
            :statetime="formInline.beginDate"
            @change="timeSelect"
          />
        </el-form-item>
        <el-form-item label="状态:" prop="state" style="width: 240px">
          <el-select v-model="formInline.state as number" placeholder="请选择">
            <el-option
              v-for="item in data.tables"
              :key="item.id"
              :label="item.lable"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 15px">
      <div style="margin: 10px 0">
        <el-button type="primary" @click="add">新增潜在客户</el-button>
        <el-button>EXCEL导入</el-button>
        <AffDialog v-if="isdialog" @close="close" />
      </div>
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        autoWidth="350px"
      >
        <template #operate="scope">
          <el-button text type="primary" @click="handleedit(scope.data.id)"
            >编辑</el-button
          >
          <el-button text type="primary" @click="details(scope.data.id)"
            >详情</el-button
          >
          <el-button
            text
            type="primary"
            @click="register(scope.data.id, scope.data.name)"
            >咨询登记</el-button
          >
          <el-button text type="primary" @click="handleDelete(scope.data.id)"
            >删除</el-button
          >
        </template>
      </MayTable>
      <Pagination
        :page="formInline.page"
        :pszie="formInline.page"
        :total="data.token"
        @page="page"
        @psize="psize"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import AffDialog from "@/components/dialog/care/AffDialog.vue";
import MayDateTimePicker from "@/components/timepicker/MayDateTimePicker.vue";
import { getMessageBox } from "@/utils/utils";
import { CustomerDelete, CustomerList } from "@/service/market/CustomerApi";
import type { CustomerParams } from "@/service/market/CustomerType";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const Refcustomer = ref();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const formInline = reactive<CustomerParams>({
  page: 1,
  pageSize: 5,
  name: "",
  idCard: "",
  beginDate: "",
  state: null,
  endDate: "",
});

// 重置
const reset = () => {
  formInline.page = 1;
  Refcustomer.value?.resetFields();
  formInline.endDate = "";
  getlist();
};
// 查询
const search = () => {
  formInline.page = 1;
  getlist();
};

const isdialog = ref(false);
const data = reactive({
  token: undefined,
  tables: [
    { lable: "预定中", id: "2" },
    { lable: "未签约", id: "1" },
    { lable: "已入院", id: "3" },
  ] as any,
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
      prop: "gender",
      label: "性别",
    },
    {
      prop: "idCard",
      label: "身份证",
    },
    {
      prop: "source",
      label: "来源渠道",
    },
    {
      prop: "addTime",
      label: "创建时间",
    },
    {
      prop: "stateName",
      label: "状态",
    },
  ],
});
// 潜在客户列表
const getlist = async () => {
  const res: any = await CustomerList(formInline);
  console.log("潜在客户列表", res);
  if (res.code == 10000) {
    data.tableData = res.data.list;
    data.token = res.data.counts;
  }
};
// 时间
const timeSelect = (val: any) => {
  formInline.beginDate = val[0];
  formInline.endDate = val[1];
};
// 关闭弹窗
const close = () => {
  isdialog.value = false;
};
// 新增
const add = () => {
  router.push("/market/customer-add");
};
// 编辑
const handleedit = (id: any) => {
  router.push(`/market/customer-edit/${id}`);
};
// 详情
const details = (id: any) => {
  router.push(`/market/customer-details/${id}`);
};
// 删除
const handleDelete = async (id: any) => {
  let res = await getMessageBox("是否删除潜在客户？", "删除后将不可恢复");
  if (res) {
    const res: any = await CustomerDelete(id);
    console.log("删除", res);
    if (res.code == 10000) {
      await getlist();
      ElMessage.success("删除成功");
    } else {
      ElMessage.error(res.msg);
    }
  } else {
    ElMessage.info("取消删除");
  }
};

// 咨询登记
const register = (id: number, name: string) => {
  router.push({
    path: "/market/question",
    query: {
      id,
      name,
    },
  });
};

//分页
const page = (val: number) => {
  formInline.page = val;
  getlist();
};
const psize = (val: number) => {
  formInline.pageSize = val;
  getlist();
};
onMounted(() => {
  getlist();
});
</script>
<style lang="less" scoped></style>
