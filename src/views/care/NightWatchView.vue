<template>
  <div class="app-container">
    <!-- 夜巡管理 -->
    <el-card>
      <AddNightDialog v-if="isdialog" @close="close" />
      <el-form
        ref="Refnight"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="上报人：" prop="name">
          <el-input v-model="formInline.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="巡检地址：" prop="address">
          <el-select
            v-model="formInline.address"
            clearable
            placeholder="请选择"
            style="width: 240px"
          >
            <el-option
              v-for="item in data.sitelist"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="巡检上报时间：" prop="beginDate">
          <MayDateTimePicker
            :endtime="formInline.endDate"
            :statetime="formInline.beginDate"
            @change="timeSelect"
          />
        </el-form-item>
        <el-form-item label="巡检状态：" prop="state">
          <el-select
            v-model="formInline.state"
            clearable
            placeholder="请选择"
            style="width: 240px"
          >
            <el-option
              v-for="item in data.statelist"
              :key="item"
              :label="item"
              :value="item"
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
        <el-button type="primary" @click="add">增加</el-button>
        <el-button @click="location">地址管理</el-button>
      </div>
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        autoWidth="110px"
      >
        <template #operate="{ data }">
          <el-button :icon="Delete" text type="danger" @click="del(data.id)"
            >删除</el-button
          >
        </template>
      </MayTable>
      <Pagination
        :page="formInline.page"
        :pszie="formInline.page"
        :total="data.total"
        @page="page"
        @psize="psize"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import { patrolDelete, patrolList } from "@/service/patrol/PatrolApi";
import { addresslist } from "@/service/address/AddressApi";
import type { AddressSelect, PatrolList } from "@/service/patrol/PatrolType";
import { getMessageBox } from "@/utils/utils";
import { useRouter } from "vue-router";
import MayDateTimePicker from "@/components/timepicker/MayDateTimePicker.vue";

const Refnight = ref();
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);

const AddNightDialog = defineAsyncComponent(
  () => import("@/components/dialog/care/AddNightDialog.vue")
);
const formInline = reactive<PatrolList>({
  page: 1,
  pageSize: 10,
  name: "",
  address: "",
  state: undefined,
  beginDate: "",
  endDate: "",
});
const isdialog = ref(false);
const data = reactive({
  total: undefined as any,
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "address",
      label: "巡检地点",
    },
    {
      prop: "addTime",
      label: "巡检上报时间",
    },
    {
      prop: "staffName",
      label: "上报人",
    },
    {
      prop: "state",
      label: "巡检状态",
    },
    {
      prop: "comment",
      label: "巡检记录",
    },
  ],
  sitelist: [] as Array<AddressSelect>,
  statelist: ["正常", "异常", "未巡检"] as any,
});

onMounted(() => {
  getlist();
  getaddresslist();
});
// 获取列表
const getlist = async () => {
  let res: any = await patrolList(formInline).catch(() => {});
  console.log("夜巡列表", res);
  if (res?.code === 10000) {
    data.tableData = res.data.list;
    // data.statelist = res.data.list;
    data.total = res.data.counts;
  }
};
// 搜索
const search = () => {
  formInline.page = 1;
  getlist();
};

// 巡检上报时间
const timeSelect = (val: any) => {
  formInline.beginDate = val[0];
  formInline.endDate = val[1];
};

// 地址列表
const getaddresslist = async () => {
  let res: any = await addresslist();
  console.log("地址列表", res);
  if (res?.code === 10000) {
    data.sitelist = res.data.list;
  }
};

// 跳转地址管理
const location = () => {
  router.push("/care/Address");
};
// 增加
const add = () => {
  isdialog.value = true;
};
// 重置
const reset = () => {
  formInline.endDate = "";
  Refnight.value?.resetFields();
  formInline.page = 1;
  getlist();
};

// 关闭弹窗
const close = (isclose: boolean) => {
  if (isclose == true) {
    getlist();
  }
  isdialog.value = false;
};
// 删除
const del = async (id: number) => {
  console.log(id);
  let box = await getMessageBox("是否确认删除该条记录", "删除后将不可恢复");

  if (box) {
    let res: any = await patrolDelete(id).catch(() => {});
    console.log("删除", res);
    if (res?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
    }
  } else {
    ElMessage.info("取消删除");
  }
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
  getaddresslist();
  getlist();
});
</script>
<style lang="less" scoped></style>
