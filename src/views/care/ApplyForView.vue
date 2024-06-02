<template>
  <!--外出登记  -->
  <div class="app-container">
    <el-card>
      <RegDialog v-if="isdialog" @close="close" />
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="老人姓名：">
          <el-input v-model="formInline.user" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="登记时间：">
          <TimePicker />
        </el-form-item>
        <el-form-item label="登记人：">
          <el-select
            v-model="formInline.user"
            placeholder="请选择"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in data.reglist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select
            v-model="formInline.user"
            placeholder="请选择"
            size="large"
            style="width: 240px"
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
      <!-- 表格 -->
      <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
        <template #operate>
          <el-button type="primary" text @click="isdialog = true"
            >延期</el-button
          >

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
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const TimePicker = defineAsyncComponent(
  () => import("@/components/timepicker/MayTimePicker.vue")
);
const RegDialog = defineAsyncComponent(
  () => import("@/components/dialog/care/RegDialog.vue")
);
const formInline = reactive({
  user: "",
  region: "",
  date: "",
});
const isdialog = ref(false);
// 关闭弹窗
const close = () => {
  isdialog.value = false;
};

// 详情
const getinfo = () => {
  router.push({
    path: "/goexamine",
  });
};

const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "老人名称",
    },
    {
      prop: "address",
      label: "床位号",
    },
    {
      prop: "manager",
      label: "外出授权日期",
    },
    {
      prop: "phone",
      label: "登记人",
    },
    {
      prop: "username",
      label: "登记时间",
    },
    {
      prop: "userpass",
      label: "预计返回日期",
    },
    {
      prop: "creator",
      label: "状态",
    },
  ],
  reglist: [] as any,
  statelist: [] as any,
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = AffiliatedView;
  }, 1000);
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
