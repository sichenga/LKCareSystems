<template>
  <div class="app-container">
    <!-- 血糖记录 -->
    <!-- dialog写在medicalcare文件夹下 -->
    <el-card style="max-width: 100%">
      <el-form
        ref="Refsugar"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="老人:" prop="name">
          <el-input v-model="formInline.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="预定床位" prop="begId">
          <MayCascader
            :options="data.beddata"
            @change="bedselect"
            :emitid="Number(formInline.begId)"
          />
        </el-form-item>
        <el-form-item label="日期:" prop="beginDate">
          <MayDateTimePicker
            @change="timeSelect"
            :statetime="formInline.beginDate"
            :endtime="formInline.endDate"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="max-width: 100%" class="card">
      <el-button type="primary" @click="add" style="margin-bottom: 30px"
        >添加血糖记录</el-button
      >
      <!-- 表格 -->
      <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
        <template #operate="{ data }">
          <el-button type="primary" text @click="edit(data)">编辑</el-button>
          <el-button type="primary" text @click="handleDelete(data.id)"
            >删除</el-button
          >
        </template>
      </MayTable>
      <!-- 分页 -->
      <Pagination
        :total="data.total"
        @page="page"
        @psize="psize"
        :page="formInline.page"
        :pszie="formInline.page"
      />
      <!-- 新增 -->
      <BloodSugarDialog v-if="dialogVisible" @close="close" :data="editid" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import {
  BloodSugarList,
  BloodSugarDelete,
} from "@/service/medicalcare/MedicalcareApi";
import type { bloodSugarlistParams } from "@/service/medicalcare/MedicalcareType";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import MayCascader from "@/components/cascader/MayCascader.vue";
import BloodSugarDialog from "@/components/dialog/medicalcare/BloodSugarDialog.vue";
import MayDateTimePicker from "@/components/timepicker/MayDateTimePicker.vue";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import { useBuildStroke } from "@/store";
const getUserInfo = useBuildStroke();
const formInline = reactive<bloodSugarlistParams>({
  page: 1,
  pageSize: 5,
  name: "",
  beginDate: "", //开始时间yyyy-MM-dd
  endDate: "", //结束时间
  begId: null,
});
const data = reactive({
  total: undefined as any,
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
      prop: "title",
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
      prop: "val",
      label: "血糖",
    },
  ],
  beddata: [] as any,
});
// 血糖记录列表
const getlist = async () => {
  const res: any = await BloodSugarList(formInline);

  if (res.code == 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
  }
};
onMounted(() => {
  getlist();
  bedlist();
});
//弹出框
const dialogVisible = ref(false);
const close = (val: any) => {
  if (val) {
    getlist();
  }
  dialogVisible.value = false;
};
// 查询
const search = () => {
  formInline.page = 1;
  getlist();
};

// 添加
const add = () => {
  dialogVisible.value = true;
  editid.value = 0;
};

// 编辑
const editid = ref(0);
const edit = (data: any) => {
  editid.value = data;
  dialogVisible.value = true;
};
//删除
const handleDelete = async (id: any) => {
  let res = await getMessageBox("是否确认删除该血糖记录", "删除后将不可恢复");
  if (res) {
    const del: any = await BloodSugarDelete(id);
    if (del?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
    } else {
      ElMessage.error("删除失败");
    }
  } else {
    ElMessage.info("取消删除");
  }
};

// 重置
const Refsugar = ref();
const reset = () => {
  formInline.page = 1;
  Refsugar.value?.resetFields();
  getlist();
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

// 日期
const timeSelect = (val: any) => {
  formInline.beginDate = val[0];
  formInline.endDate = val[1];
};

// 获取床位列表
const bedlist = async () => {
  data.beddata = await getUserInfo.getBuildListData();
};
// 床位
const bedselect = (val: any) => {
  formInline.begId = val;
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
