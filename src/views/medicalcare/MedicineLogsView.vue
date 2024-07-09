<template>
  <div class="app-container">
    <!-- 用药登记 -->
    <el-card>
      <el-form
        ref="Refmedicinelogs"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="老人：" prop="name">
          <el-input v-model="formInline.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="登记时间：">
          <MayDateTimePicker
            :endtime="formInline.endDate"
            :statetime="formInline.beginDate"
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
      <div style="margin: 15px 0">
        <el-button type="primary" @click="registerinfo">用药登记</el-button>
        <OldSelectDialog
          v-if="isdialog"
          :toPath="'/medicalcare/add'"
          @close="close"
        />
      </div>
      <!-- 表格 -->
      <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
        // eslint-disable-next-line vue/no-template-shadow
        <template #operate="{ data }">
          <el-button text type="primary" @click="details(data.elderlyId)"
            >查看详情</el-button
          >
          <el-button text type="primary" @click="project(data.elderlyId)"
            >用药计划</el-button
          >
        </template>
      </MayTable>
      <Pagination
        :page="formInline.page"
        :pageSize="formInline.pageSize"
        :total="total"
        @page="getpage"
        @psize="getpsize"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { DrugsList } from "@/service/medicalcare/MedicalcareApi";
import type { DrugsParams } from "@/service/medicalcare/MedicalcareType";
import OldSelectDialog from "@/components/dialog/OldSelect/OldSelectDialog.vue";

const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const MayDateTimePicker = defineAsyncComponent(
  () => import("@/components/timepicker/MayDateTimePicker.vue")
);
const total = ref(0);
const isdialog = ref(false);
const Refmedicinelogs = ref();
const formInline = reactive<DrugsParams>({
  begId: "",
  beginDate: "",
  endDate: "",
  name: "",
  page: 1,
  pageSize: 10,
});
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
      prop: "counts",
      label: "用药品种类",
    },
    {
      prop: "addAccountName",
      label: "登记人",
    },
    {
      prop: "addTime",
      label: "最新登记时间",
    },
  ],
});

// 重置
const reset = () => {
  Refmedicinelogs.value?.resetFields();
  formInline.beginDate = "";
  formInline.endDate = "";
  formInline.page = 1;
  getlist();
};
// 用药登记列表
const getlist = async () => {
  let res: any = await DrugsList(formInline);
  console.log("用药登记列表", res);

  if (res?.code === 10000) {
    total.value = res.data.counts;
    data.tableData = res.data.list;
  }
};
// 用药登记
const registerinfo = () => {
  // router.push({
  //   path: '/medicalcare/medicinelogs/add',
  //   query:{id}
  // })
  isdialog.value = true;
};
// 查询
const sond = () => {
  formInline.page = 1;
  getlist();
};
// 查看详情
const details = (id: number) => {
  router.push({
    path: `/medicalcare/details/${id}`,
  });
};
// 用药计划
const project = (id: number) => {
  router.push({
    path: "/medicalcare/planset",
    query: {
      id,
    },
  });
};
// 登记时间
const timeSelect = (val: any) => {
  formInline.beginDate = val[0];
  formInline.endDate = val[1];
};
// 分页
const getpage = (page: number) => {
  formInline.page = page;
  getlist();
};
const getpsize = (pageSize: number) => {
  formInline.pageSize = pageSize;
  getlist();
};
// 关闭弹窗
const close = () => {
  isdialog.value = false;
};
onMounted(() => {
  getlist();
});
</script>
<style lang="less" scoped></style>
