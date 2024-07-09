<template>
  <div class="app-container">
    <!-- 血压记录 -->
    <!-- dialog写在medicalcare文件夹下 -->
    <el-card style="max-width: 100%">
      <BloodDialog v-if="isdialog" @close="close" :data="editid" />
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="老人:">
          <el-input v-model="formInline.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="床位:">
          <MayCascader
            :options="data.beddata"
            @change="bedSelect"
            :emitid="formInline.begId ? formInline.begId : 0"
          />
        </el-form-item>
        <el-form-item label="查询时间:">
          <MayDateTimePicker
            @change="timeSelect"
            :statetime="formInline.beginDate"
            :endtime="formInline.endDate"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="inquire" :icon="Search"
            >查询</el-button
          >
          <el-button @click="reset" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="max-width: 100%" class="card">
      <div style="margin: 10px 0">
        <el-button type="success" :icon="Plus" @click="add">增加</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="!ids.length"
          @click="handleDeleteAll()"
          >批量删除</el-button
        >
      </div>
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        autoWidth="220px"
        :isMultiple="true"
        @serve-list-is="serveListIs"
      >
        <template #operate="{ data }">
          <el-button type="primary" text @click="edit(data)" :icon="Edit"
            >编辑</el-button
          >
          <el-button type="danger" :icon="Delete" text @click="del(data.id)"
            >删除</el-button
          >
        </template>
      </MayTable>
      <Pagination
        :total="total"
        :page="formInline.page"
        :psize="formInline.pageSize"
        @page="getpage"
        @psize="getpsize"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import BloodDialog from "@/components/dialog/medicalcare/BloodDialog.vue";
import { useBuildStroke } from "@/store";
import MayCascader from "@/components/cascader/MayCascader.vue";
import MayDateTimePicker from "@/components/timepicker/MayDateTimePicker.vue";
import {
  BloodPressureList,
  BloodPressureDelete,
  BloodPressureDeleteAll,
} from "@/service/medicalcare/MedicalcareApi";
import type { BloodPressureParams } from "@/service/medicalcare/MedicalcareType";
import { Delete, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const getUserInfo = useBuildStroke();
const editid = ref({});

const formInline = reactive<BloodPressureParams>({
  begId: null,
  beginDate: "",
  endDate: "",
  name: "",
  page: 1,
  pageSize: 10,
});
const total = ref(0);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "addTime",
      label: "统计日期",
    },
    {
      prop: "addAccountName",
      label: "记录人",
    },
    {
      prop: "elderlyName",
      label: "老人姓名",
    },
    {
      prop: "begName",
      label: "床位",
    },
    {
      prop: "bloodPressure",
      label: "血压",
    },
    {
      prop: "pulse",
      label: "脉搏",
    },
  ],
  beddata: [] as any,
});
// 血压列表
const getlist = async () => {
  let res: any = await BloodPressureList(formInline);
  console.log(res, "血压列表");

  if (res?.code == 10000) {
    total.value = res.data.counts;
    data.tableData = res.data.list;
  }
};

// 批量删除
let ids = ref<any>([]);
const serveListIs = (val: any) => {
  ids.value = val.map((item: any) => item.id);
};
//批量删除
const handleDeleteAll = async () => {
  let res = await getMessageBox("是否确认删除该数据", "删除后将不可恢复");
  if (res) {
    const del: any = await BloodPressureDeleteAll(ids.value);
    if (del?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
    }
  } else {
    ElMessage.info("取消删除");
  }
};

// 增加
const add = () => {
  editid.value = {};
  isdialog.value = true;
};
// 编辑
const edit = (data: any) => {
  editid.value = data;
  isdialog.value = true;
};
// 删除
const del = async (id: number) => {
  let box = await getMessageBox("是否删除该条数据?", "");
  if (box) {
    let res: any = await BloodPressureDelete(id);
    if (res?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
    }
  }
};
// 获取床位列表
const bedlist = async () => {
  data.beddata = await getUserInfo.getBuildListData();
};
// 床位选择
const bedSelect = (val: any) => {
  formInline.begId = val;
};
// 分页
const getpage = (val: number) => {
  formInline.page = val;
  getlist();
};
const getpsize = (val: number) => {
  formInline.pageSize = val;
  getlist();
};
// 查询
const inquire = () => {
  formInline.page = 1;
  getlist();
};
// 重置
const reset = () => {
  formInline.name = "";
  formInline.beginDate = "";
  formInline.endDate = "";
  formInline.begId = null;
  getlist();
};
// 选择日期
const timeSelect = (val: any) => {
  formInline.beginDate = val[0];
  formInline.endDate = val[1];
};
onMounted(() => {
  getlist();
  bedlist();
});
//弹出框
const isdialog = ref(false);
const close = (val: any) => {
  if (val) {
    getlist();
  }
  isdialog.value = false;
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
