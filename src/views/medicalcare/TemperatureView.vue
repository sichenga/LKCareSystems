<template>
  <div>
    <!-- 体温记录 -->
    <!-- dialog写在medicalcare文件夹下 -->
    <el-card style="max-width: 100%">
      <el-form
        ref="Reftemperature"
        :inline="true"
        :model="params"
        class="demo-form-inline"
      >
        <el-form-item label="老人:" prop="name">
          <el-input v-model="params.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="床位:" prop="begId">
          <!-- <el-select  placeholder="请选择">
            <el-cascader v-model="params.begId" :options="options" @change="handleChange" />
        </el-select> -->
          <MayCascader
            :options="data.beddata"
            @change="bedselect"
            :emitid="Number(params.begId)"
          />
        </el-form-item>
        <el-form-item label="日期:" prop="beginDate">
          <MayDateTimePicker
            @change="timeSelect"
            :statetime="params.beginDate"
            :endtime="params.endDate"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="inquire">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-button type="primary" style="margin-top: 20px" @click="add"
      >新增体温</el-button
    >

    <TemperatureDialog v-if="dialogVisible" @close="close" :data="datas" />

    <el-card style="max-width: 100%" class="card">
      <!-- 表格 -->
      <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
        <template #operate="{ data }">
          <el-button type="primary" size="small" text @click="del(data.id)"
            >删除</el-button
          >
          <el-button type="primary" size="small" text @click="record(data)"
            >编辑</el-button
          >
        </template>
      </MayTable>
      <Pagination
        @page="handlPage"
        @p-size="handlpSize"
        :page="params.page"
        :psize="params.pageSize"
        :total="counts"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import {
  TemperatureList,
  TemperatureDelete,
} from "@/service/medicalcare/MedicalcareApi";
import type { MedicalcareParams } from "@/service/medicalcare/MedicalcareType";
import TemperatureDialog from "@/components/dialog/medicalcare/TemperatureDialog.vue";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import MayCascader from "@/components/cascader/MayCascader.vue";
import MayDateTimePicker from "@/components/timepicker/MayDateTimePicker.vue";
import { useBuildStroke } from "@/store";
const getUserInfo = useBuildStroke();
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
      prop: "houseName",
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
      label: "体温",
    },
  ],
  beddata: [] as any,
});
const params = reactive<MedicalcareParams>({
  page: 1,
  pageSize: 10,
  name: "", //老人姓名
  beginDate: "", //开始时间yyyy-MM-dd
  endDate: "", //结束时间
  begId: null, //床位Id
});
//体温列表
let counts = 0;
const getlist = async () => {
  let res: any = await TemperatureList(params);

  if (res?.code === 10000) {
    data.tableData = res.data.list;
    counts = res.data.counts;
  }
};
// 重置
const Reftemperature = ref();
const reset = () => {
  params.page = 1;
  Reftemperature.value?.resetFields();
  params.endDate = "";
  getlist();
};
//弹出框
const dialogVisible = ref(false);

const close = (val: any) => {
  dialogVisible.value = val;
  if (val == true) {
    dialogVisible.value = false;
    getlist();
  }
};

let datas = ref<any>({});
// 选择日期
const timeSelect = (val: any) => {
  params.beginDate = val[0];
  params.endDate = val[1];
};

// 添加
const add = () => {
  datas.value = {};
  dialogVisible.value = true;
};
// 编辑
const record = (data: any) => {
  datas.value = data;
  dialogVisible.value = true;
};
// 删除
const del = async (id: number) => {
  let res = await getMessageBox("是否确认删除此体温记录", "删除后将不可恢复");
  if (res) {
    let _del: any = await TemperatureDelete(id);
    if (_del?.code == 10000) {
      getlist();
      ElMessage.success("删除成功");
    }
  } else {
    ElMessage.info("取消删除");
  }
};
// 搜索
const inquire = () => {
  params.page = 1;
  getlist();
};
// 分页
const handlPage = (val: any) => {
  params.page = val;
  getlist();
};
const handlpSize = (val: any) => {
  params.pageSize = val;
  getlist();
};
// 获取床位列表
const bedlist = async () => {
  data.beddata = await getUserInfo.getBuildListData();
};
// 选择床位
const bedselect = (val: any) => {
  params.begId = val;
};
onMounted(() => {
  getlist(); //体温列表
  bedlist();
});
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
