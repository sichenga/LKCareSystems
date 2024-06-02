<template>
  <div class="app-container">
    <!-- <div>出院管理</div> -->
    <el-card style="max-width: 100%">
      <el-form
        ref="Refdischarge"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="老人姓名" prop="name">
          <el-input v-model="formInline.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard">
          <el-input
            v-model="formInline.idCard"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="formInline.state" placeholder="请选择" clearable>
            <el-option :label="'待出院'" :value="0" />
            <el-option :label="'已出院'" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searcher">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="max-width: 100%" class="card">
      <!-- 新增 -->
      <el-button type="primary" @click="add" style="margin-bottom: 20px"
        >新增出院申请</el-button
      >
      <!-- 表格 -->
      <MayTable
        :identifier="identifier"
        :tableData="data.tableData"
        :tableItem="data.tableItem"
      >
        <template #operate="{ data }">
          <el-button type="primary" text @click="edit(data.id)">编辑</el-button>
          <el-button type="primary" text @click="del(data.id)">删除</el-button>
          <el-button type="primary" text @click="leave">确认出院</el-button>
        </template>
      </MayTable>
      <Pagination
        @page="pageChenge"
        @psize="pageSizeChenge"
        :page="formInline.page"
        :psize="formInline.pageSize"
        :total="data.total"
      />
      <!-- 新增 -->
      <DischargeDialog v-if="isdialog" :id="idetit" @close="close" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { dischargeList, dischargeDelete } from "@/service/market/DischargeApi";
import type { dischargeListParams } from "@/service/market/DischargeType";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const DischargeDialog = defineAsyncComponent(
  () => import("@/components/dialog/market/DischargeDialog.vue")
);
import { getMessageBox } from "@/utils/utils";
const identifier = "Discharge";
const formInline = reactive<dischargeListParams>({
  page: 1,
  pageSize: 5,
  name: "",
  idCard: null,
  mobile: "",
  begId: null,
  state: "",
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
      prop: "elderlyName",
      label: "老人姓名",
    },
    {
      prop: "elderlyGender",
      label: "性别",
    },
    {
      prop: "elderlyIdCard",
      label: "身份证号",
    },
    {
      prop: "begName",
      label: "原床位",
    },
    {
      prop: "begName",
      label: "变更后床位",
    },
    {
      prop: "userpass",
      label: "申请人",
    },
    {
      prop: "addTime",
      label: "申请日期",
    },
    {
      prop: "state",
      label: "状态",
    },
  ],
});
// 出院列表
const getlist = async () => {
  const res: any = await dischargeList(formInline);
  console.log("出院列表", res);
  if (res.code == 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
  }
};
// 关闭弹窗
const close = (val: boolean) => {
  isdialog.value = false;
  if (val) {
    getlist();
  }
};
// 新增
const add = () => {
  isdialog.value = true;
  idetit.value = 0;
};
// 编辑
const idetit = ref(0);
const edit = (id: number) => {
  isdialog.value = true;
  idetit.value = id;
};
// 重置
const Refdischarge = ref();
const reset = () => {
  formInline.page = 1;
  Refdischarge.value.resetFields();
  getlist();
};
// 删除
const del = async (id: number) => {
  let res = await getMessageBox("是否确认删除出院", "删除后将不可恢复");
  console.log(11112, res);
  if (res) {
    const res: any = await dischargeDelete(id);
    if (res.code == 10000) {
      getlist();
      ElMessage.success("删除成功");
    } else {
      ElMessage.error(res.msg);
    }
  } else {
    ElMessage.info("取消删除");
  }
};

//查询
const searcher = () => {
  formInline.page = 1;
  getlist();
};

// 确认出院
const leave = () => {
  ElMessageBox.confirm("是否确认出院？,出院后将不可恢复?", "出院确认")
    .then(() => {
      ElMessage({
        type: "success",
        message: "确认出院",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消出院",
      });
    });
};

// 分页
const pageChenge = (val: any) => {
  formInline.page = val;
  getlist();
};
const pageSizeChenge = (val: any) => {
  formInline.pageSize = val;
  getlist();
};
onMounted(() => {
  getlist();
});
</script>

<style lang="less" scoped>
.card {
  margin-top: 20px;
}

.demo-form-inline .el-input {
  --el-input-width: 200px;
}

.demo-form-inline .el-select {
  --el-select-width: 200px;
}
</style>
